<!-- 
	This is the tables page, it uses the dashboard layout in: 
	"./layouts/Dashboard.vue" .
 -->

<template>
  <div>
    <!-- Authors Table -->
    <a-row :gutter="24" type="flex">
      <a-col :span="24">
        <a-card>
          <h5>Edit Barang {{ name }}</h5>
          <a-input placeholder="Nama Barang" v-model="name" />
          <br /><br />
          <a-input placeholder="Jumlah" v-model="quantity" /><br /><br />
          <a-select default-value="ml" v-model="unit" style="width: 100%">
            <a-select-option value="ml"> ml </a-select-option>
            <a-select-option value="gr"> gr </a-select-option>
            <a-select-option value="pcs"> pcs </a-select-option>
          </a-select>

          <br /><br />

          <a-button
            @click="cancelEdit"
            type="default"
            style="margin-right: 10px"
            >Batal</a-button
          >
          <a-button @click="handleEdit()" type="primary"> Simpan </a-button>
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
      inventory: null,
      name: null,
      quantity: null,
      unit: null,
      cabang: null,
    };
  },
  async mounted() {
    this.itemId = this.$route.params.id;
    this.cabang = JSON.parse(localStorage.getItem("cabang"));
    this.getEdit();
  },
  methods: {
    cancelEdit() {
      this.$router.push(`/inventory`);
    },
    async getEdit() {
      const { data, error } = await supabase
        .from("ingredient")
        .select("*")
        .eq("id", this.itemId);

      if (error) {
        console.log("Error get Ingridient", error);
      } else if (data && data.length > 0) {
        this.inventory = data[0];
        console.error("inventory", this.inventory);

        this.name = this.inventory.name;
        this.quantity = this.inventory.quantity;
        this.unit = this.inventory.unit;
      } else {
        console.log("No matching cabang found");
      }
    },
    async handleEdit() {
      const { data, error } = await supabase
        .from("ingredient")
        .upsert({
          id: this.itemId,
          name: this.name,
          quantity: this.quantity,
          unit: this.unit,
          id_cabang: this.cabang.id,
        })
        .select();

      if (error) {
        this.$error({
          title: "Gagal Merubah Barang",
          content: error,
        });
      } else {
        this.$success({
          title: "Berhasil Merubah Barang",
          // JSX support
          content: (
            <div>
              <p>Barang Berhasil di ubah</p>
            </div>
          ),
        });

        this.$router.push(`/inventory`);
      }
    },
  },
};
</script>

<style lang="scss"></style>
