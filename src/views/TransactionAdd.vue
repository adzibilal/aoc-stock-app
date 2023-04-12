<template>
  <div>
    <!-- Authors Table -->
    <a-row :gutter="24" type="flex">
      <a-col :span="24">
        <a-card>
          <h5>Tambah Transaksi</h5>
          <a-row
            class="ingredient-item"
            v-for="(pes, index) in pesanan"
            :key="index"
          >
            <a-col :span="12">
              <a-select
                default-value="ml"
                v-model="pes.menu_id"
                style="width: 100%"
              >
                <a-select-option
                  v-for="(item, index) in menu"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :span="9">
              <a-input
                placeholder="Jumlah"
                v-model="pes.quantity"
              /><br /><br />
            </a-col>
            <a-col :span="3">
              <a-button type="danger" @click="deletePesanan(index)">
                X
              </a-button>
            </a-col>
          </a-row>

          <a-button type="default" @click="tambahMenu">Tambah Menu</a-button>
          <br /><br />
          <a-button @click="cancelAdd" type="default" style="margin-right: 10px"
            >Batal</a-button
          >
          <a-button
            @click="handleAdd()"
            type="primary"
            style="margin-right: 10px"
          >
            Simpan Transaksi
          </a-button>
          <a-button @click="handleAdd()" type="primary">
            Selesaikan Transaksi
          </a-button>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { supabase } from "../lib/supabaseClient";
import { Modal } from "ant-design-vue";
export default {
  data() {
    return {
      itemId: null,
      cabang: null,
      menu: null,
      pesanan: [{ menu_id: "", quantity: "" }],
    };
  },
  async mounted() {
    this.itemId = this.$route.params.id;
    this.cabang = JSON.parse(localStorage.getItem("cabang"));
    this.getMenu();
  },
  methods: {
    cancelAdd() {
      this.$router.push(`/transaction`);
    },
    tambahMenu() {
      // membuat objek baru berdasarkan data yang diinputkan user
      const newMenu = {
        menu_id: "",
        quantity: "",
      };

      // menambahkan objek baru ke dalam array
      this.pesanan.push(newMenu);
    },
    deletePesanan(index) {
      // menghapus item dari array berdasarkan index
      this.pesanan.splice(index, 1);
    },
    async getMenu() {
      this.cabang = JSON.parse(localStorage.getItem("cabang"));

      const { data, error } = await supabase
        .from("menu")
        .select("*")
        .eq("id_cabang", this.cabang.id);

      if (error) {
        console.log("Error get menu", error);
      } else if (data && data.length > 0) {
        this.menu = data; // assuming only one employee is returned
        console.error("menu", this.menu);
      } else {
        console.log("No matching cabang found");
      }
    },
    newTimestamp() {
      // membuat objek Date baru
      let date = new Date();

      // mengambil nilai tanggal, bulan, tahun, jam, menit, detik, dan milidetik
      let year = date.getFullYear();
      let month = ("0" + (date.getMonth() + 1)).slice(-2);
      let day = ("0" + date.getDate()).slice(-2);
      let hours = ("0" + date.getHours()).slice(-2);
      let minutes = ("0" + date.getMinutes()).slice(-2);
      let seconds = ("0" + date.getSeconds()).slice(-2);
      let milliseconds = ("00" + date.getMilliseconds()).slice(-3);

      // membuat datetime format time stamp
      let timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;

      return timestamp
    },
    async handleAdd() {
      const { data, error } = await supabase
        .from("transaction")
        .insert({ date: this.newTimestamp(), id_cabang: this.cabang.id })
        .select();
      if (error) {
        console.log("err handle add", error);
      } else if (data && data.length > 0) {
        console.error('data',data);
        const transactionId = data[0].id;
        console.error('transactionId',transactionId);
        const pesananWithId = this.pesanan.map((pesan) => ({
          ...pesan,
          transaction_id: transactionId,
        }));

        console.error("pesananWithId", pesananWithId);

        const { error } = await supabase
          .from("transaction_detail")
          .insert(pesananWithId);
        if (error) {
          console.error("err handle add transaction_detail", error);
        } else {
          console.error("berhasil");
          this.$router.push(`/transaction`);
        }
      } else {
        console.log("err handle add");
      }
    },
  },
};
</script>

<style lang="scss"></style>
