<!-- 
	This is the tables page, it uses the dashboard layout in: 
	"./layouts/Dashboard.vue" .
 -->

<template>
    <div>
        <!-- Authors Table -->
        <a-row :gutter="24" type="flex">
            <a-input-search
                :span="24"
                @search="onSearch"
                placeholder="Cari Menu"
                style="margin: 15px"
            ></a-input-search>
            <!-- Authors Table Column -->
            <a-col :span="24" class="mb-24">
                <a-card
                    :bordered="false"
                    class="header-solid h-full"
                    :bodyStyle="{ padding: 0 }"
                >
                    <template #title>
                        <a-row type="flex" align="middle">
                            <a-col :span="14" :md="16">
                                <h5 class="font-semibold m-0">
                                    Data transaction
                                </h5>
                            </a-col>
                            <a-col :span="6" :md="6">
                                <!-- <a-radio-group v-model="authorsHeaderBtns" size="small">
                  <a-radio-button value="all">ALL</a-radio-button>
                  <a-radio-button value="online">ONLINE</a-radio-button>
                </a-radio-group> -->
                                <a-button type="primary" @click="addMenu">
                                    Tambah Transaksi
                                </a-button>
                            </a-col>
                        </a-row>
                    </template>
                    <a-table
                        :columns="table1Columns"
                        :data-source="transaction"
                        :pagination="true"
                    >
                        <template slot="date" slot-scope="row">
                            <p>{{ formatDate(row) }}</p>
                        </template>
                        <template slot="detail" slot-scope="row">
                            <p v-for="(item, index) in row" :key="index">
                                {{ item.menu.name }} - {{ item.quantity }}
                            </p>
                        </template>
                        <template slot="editBtn" slot-scope="row">
                            <a-row>
                                <a-col :span="12">
                                    <a-button
                                        type="default"
                                        :data-id="row.id"
                                        class="btn-edit"
                                        @click="editItem(row.id)"
                                    >
                                        Edit
                                    </a-button>
                                </a-col>
                                <a-col :span="12">
                                    <a-button
                                        type="danger"
                                        :data-id="row.id"
                                        @click="handleDelete(row.id)"
                                    >
                                        Hapus
                                    </a-button>
                                </a-col>
                            </a-row>
                        </template>
                    </a-table>
                </a-card>
                <!-- / Authors Table Card -->
                <!-- / Authors Table Card -->
            </a-col>
            <!-- / Authors Table Column -->
        </a-row>
        <!-- / Authors Table -->
    </div>
</template>

<script>
// "Authors" table component.
import CardAuthorTable from '../components/Cards/CardAuthorTable';

// "Projects" table component.
import CardProjectTable2 from '../components/Cards/CardProjectTable2';

// "Authors" table list of columns and their properties.
const table1Columns = [
    {
        title: 'Tanggal',
        dataIndex: 'date',
        scopedSlots: { customRender: 'date' },
    },
    {
        title: 'Detail',
        dataIndex: 'transaction_detail',
        scopedSlots: { customRender: 'detail' },
    },
    {
        title: '',
        scopedSlots: { customRender: 'editBtn' },
        width: 200,
    },
];

import { supabase } from '../lib/supabaseClient';
import { Modal } from 'ant-design-vue';
export default {
    components: {
        CardAuthorTable,
        CardProjectTable2,
    },
    data() {
        return {
            // Associating "Authors" table columns with its corresponding property.
            table1Columns: table1Columns,
            transaction: null,
            cabang: null,
            visible: false,
            name: '',
            quantity: '',
            unit: '',
            confDelete: false,
        };
    },
    async mounted() {
        this.gettransaction();
    },
    methods: {
        formatDate(dateStr) {
            console.error('dateStr', dateStr);
            const date = new Date(dateStr);

            const dayList = [
                'Minggu',
                'Senin',
                'Selasa',
                'Rabu',
                'Kamis',
                'Jumat',
                'Sabtu',
            ];
            const day = dayList[date.getDay()];

            const monthList = [
                'Januari',
                'Februari',
                'Maret',
                'April',
                'Mei',
                'Juni',
                'Juli',
                'Agustus',
                'September',
                'Oktober',
                'November',
                'Desember',
            ];
            const month = monthList[date.getMonth()];

            const dayOfMonth = date.getDate();

            const year = date.getFullYear();

            const hour = date.getHours();
            const minute = date.getMinutes();

            const formattedDate = `${day}, ${dayOfMonth} ${month} ${year} Pukul ${hour}.${minute}`;

            console.log(formattedDate);

            return formattedDate;
        },

        addMenu() {
            this.$router.push(`/transaction/add`);
        },
        onSearch(value) {
            console.error(value);
            if (value) {
                this.transaction = this.transaction.filter((item) =>
                    item.name.toLowerCase().includes(value.toLowerCase()),
                );
                console.error('filtered', this.transaction);
            } else {
                this.gettransaction();
            }
        },

        async gettransaction() {
            this.cabang = JSON.parse(localStorage.getItem('cabang'));

            const { data, error } = await supabase
                .from('transaction')
                .select(
                    `
            id,
            date,
            total_amount,
            transaction_detail(
              id,
              menu_id,
              quantity,
              menu(id,name)
            )
          `,
                )
                .eq('id_cabang', this.cabang.id);

            if (error) {
                console.log('Error get transaction', error);
            } else if (data && data.length > 0) {
                this.transaction = data;
                console.error('transaction', this.transaction);
            } else {
                console.log('No matching cabang found');
            }
        },

        editItem(id) {
            console.error('id', id);
            this.$router.push(`/transaction/edit/${id}`);
        },

        showModal() {
            this.visible = true;
        },
        async handleOk(e) {
            console.log(e);
            console.error('data', this.name, this.quantity, this.unit);
            const { error } = await supabase.from('ingredient').insert({
                name: this.name,
                quantity: this.quantity,
                unit: this.unit,
                id_cabang: this.cabang.id,
            });

            if (error) {
                console.error('err add barang', error);
            } else {
                this.$success({
                    title: 'Berhasil Menambah',
                    // JSX support
                    content: (
                        <div>
                            <p>Berhasil Menambah</p>
                        </div>
                    ),
                });
            }
            this.gettransaction();
            this.visible = false;
        },

        deleteItem() {
            this.confDelete = true;
        },
        async handleDelete(id) {
            if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
                const { error } = await supabase
                    .from('transaction')
                    .delete()
                    .eq('id', id);
                if (error) {
                    console.error('err delete barang', error);
                } else {
                    this.confDelete = false;
                    this.$success({
                        title: 'Berhasil Menghapus',
                        // JSX support
                        content: (
                            <div>
                                <p>Berhasil Menghapus</p>
                            </div>
                        ),
                    });
                    this.gettransaction();
                }
            }
        },
    },
};
</script>

<style lang="scss"></style>
