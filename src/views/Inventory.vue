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
        placeholder="Cari Barang"
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
              <a-col :span="12" :md="16">
                <h5 class="font-semibold m-0">Data Inventory</h5>
              </a-col>
              <a-col :span="12" :md="6">
                <!-- <a-radio-group v-model="authorsHeaderBtns" size="small">
                  <a-radio-button value="all">ALL</a-radio-button>
                  <a-radio-button value="online">ONLINE</a-radio-button>
                </a-radio-group> -->
                <a-button type="primary" @click="showModal">
                  Tambah Barang
                </a-button>
                <a-modal
                  v-model="visible"
                  title="Tambah Barang"
                  okText="Simpan"
                  cancelText="Batal"
                  @ok="handleOk"
                >
                  <a-input placeholder="Nama Barang" /> <br><br>
                  <a-input placeholder="Jumlah" /><br><br>
                  <a-select default-value="ml" style="width: 100%;">
                    <a-select-option value="ml"> ml </a-select-option>
                    <a-select-option value="gr"> gr </a-select-option>
                    <a-select-option value="pcs"> pcs </a-select-option>
                  </a-select>
                </a-modal>
              </a-col>
            </a-row>
          </template>
          <a-table
            :columns="table1Columns"
            :data-source="inventory"
            :pagination="true"
          >
            <template slot="author" slot-scope="author">
              <div class="table-avatar-info">
                <a-avatar shape="square" :src="author.avatar" />
                <div class="avatar-info">
                  <h6>{{ author.name }}</h6>
                  <p>{{ author.email }}</p>
                </div>
              </div>
            </template>

            <template slot="func" slot-scope="func">
              <div class="author-info">
                <h6 class="m-0">{{ func.job }}</h6>
                <p class="m-0 font-regular text-muted">{{ func.department }}</p>
              </div>
            </template>

            <template slot="status" slot-scope="status">
              <a-tag
                class="tag-status"
                :class="status ? 'ant-tag-primary' : 'ant-tag-muted'"
              >
                {{ status ? "ONLINE" : "OFFLINE" }}
              </a-tag>
            </template>

            <template slot="editBtn" slot-scope="row">
              <a-button
                type="link"
                :data-id="row.id"
                class="btn-edit"
                @click="editItem(row.id)"
              >
                Edit
              </a-button>
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
import CardAuthorTable from "../components/Cards/CardAuthorTable";

// "Projects" table component.
import CardProjectTable2 from "../components/Cards/CardProjectTable2";

// "Authors" table list of columns and their properties.
const table1Columns = [
  {
    title: "Nama",
    dataIndex: "name",
    scopedSlots: { customRender: "name" },
  },
  {
    title: "Jumlah",
    dataIndex: "quantity",
    scopedSlots: { customRender: "quantity" },
  },
  {
    title: "Unit",
    dataIndex: "unit",
    scopedSlots: { customRender: "unit" },
  },
  {
    title: "",
    scopedSlots: { customRender: "editBtn" },
    width: 50,
  },
];

// "Authors" table list of rows and their properties.
const table1Data = [
  {
    key: "1",
    name: "Evap",
    quantity: 1000,
    unit: "ml",
  },
  {
    key: "2",
    author: {
      avatar: "images/face-3.jpg",
      name: "Alexa Liras",
      email: "alexa@mail.com",
    },
    func: {
      job: "Programator",
      department: "Developer",
    },
    status: 0,
    employed: "23/12/20",
  },
  {
    key: "3",
    author: {
      avatar: "images/face-1.jpg",
      name: "Laure Perrier",
      email: "laure@mail.com",
    },
    func: {
      job: "Executive",
      department: "Projects",
    },
    status: 1,
    employed: "13/04/19",
  },
  {
    key: "4",
    author: {
      avatar: "images/face-4.jpg",
      name: "Miriam Eric",
      email: "miriam@mail.com",
    },
    func: {
      job: "Marketing",
      department: "Organization",
    },
    status: 1,
    employed: "03/04/21",
  },
  {
    key: "5",
    author: {
      avatar: "images/face-5.jpeg",
      name: "Richard Gran",
      email: "richard@mail.com",
    },
    func: {
      job: "Manager",
      department: "Organization",
    },
    status: 0,
    employed: "23/03/20",
  },
  {
    key: "6",
    author: {
      avatar: "images/face-6.jpeg",
      name: "John Levi",
      email: "john@mail.com",
    },
    func: {
      job: "Tester",
      department: "Developer",
    },
    status: 0,
    employed: "14/04/17",
  },
];

// "Projects" table list of columns and their properties.
const table2Columns = [
  {
    title: "COMPANIES",
    dataIndex: "company",
    scopedSlots: { customRender: "company" },
    width: 300,
  },
  {
    title: "BUDGET",
    dataIndex: "budget",
    class: "font-semibold text-muted",
  },
  {
    title: "STATUS",
    dataIndex: "status",
    class: "font-semibold text-muted text-sm",
  },
  {
    title: "COMPLETION",
    scopedSlots: { customRender: "completion" },
    dataIndex: "completion",
  },
  {
    title: "",
    scopedSlots: { customRender: "editBtn" },
    width: 50,
  },
];

// "Projects" table list of rows and their properties.
const table2Data = [
  {
    key: "1",
    company: {
      name: "Spotify Version",
      logo: "images/logos/logo-spotify.svg",
    },
    status: "working",
    budget: "$14,000",
    completion: 60,
  },
  {
    key: "2",
    company: {
      name: "Progress Track",
      logo: "images/logos/logo-atlassian.svg",
    },
    status: "working",
    budget: "$3,000",
    completion: 10,
  },
  {
    key: "3",
    company: {
      name: "Jira Platform Errors",
      logo: "images/logos/logo-slack.svg",
    },
    status: "done",
    budget: "Not Set",
    completion: {
      status: "success",
      value: 100,
    },
  },
  {
    key: "4",
    company: {
      name: "Launch new Mobile App",
      logo: "images/logos/logo-spotify.svg",
    },
    status: "canceled",
    budget: "$20,600",
    completion: {
      status: "exception",
      value: 50,
    },
  },
  {
    key: "5",
    company: {
      name: "Web Dev",
      logo: "images/logos/logo-webdev.svg",
    },
    status: "working",
    budget: "$4,000",
    completion: 80,
  },
  {
    key: "6",
    company: {
      name: "Redesign Online Store",
      logo: "images/logos/logo-invision.svg",
    },
    status: "canceled",
    budget: "$2,000",
    completion: {
      status: "exception",
      value: 0,
    },
  },
];
import { supabase } from "../lib/supabaseClient";

export default {
  components: {
    CardAuthorTable,
    CardProjectTable2,
  },
  data() {
    return {
      // Associating "Authors" table data with its corresponding property.
      table1Data: table1Data,

      // Associating "Authors" table columns with its corresponding property.
      table1Columns: table1Columns,

      // Associating "Projects" table data with its corresponding property.
      table2Data: table2Data,

      // Associating "Projects" table columns with its corresponding property.
      table2Columns: table2Columns,
      inventory: null,
      cabang: null,
      visible: false,
    };
  },
  async mounted() {
    this.getInventory();
  },
  methods: {
    onSearch(value) {
      console.error(value);
      if (value) {
        this.inventory = this.inventory.filter((item) =>
          item.name.toLowerCase().includes(value.toLowerCase())
        );
        console.error("filtered", this.inventory);
      } else {
        this.getInventory();
      }
    },

    async getInventory() {
      this.cabang = JSON.parse(localStorage.getItem("cabang"));

      const { data, error } = await supabase
        .from("ingredient")
        .select("*")
        .eq("id_cabang", this.cabang.id);

      if (error) {
        console.log("Error get Ingridient", error);
      } else if (data && data.length > 0) {
        this.inventory = data; // assuming only one employee is returned
        console.error("inventory", this.inventory);
      } else {
        console.log("No matching cabang found");
      }
    },

    editItem(id) {
      console.error("id", id);
    },

    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      console.log(e);
      this.visible = false;
    },
  },
};
</script>

<style lang="scss"></style>
