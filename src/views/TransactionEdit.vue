<template>
  <div>
    <!-- Authors Table -->
    <a-row :gutter="24" type="flex">
      <a-col :span="24">
        <a-card>
          <h5>Edit Menu</h5>
          <a-input placeholder="Nama Menu" v-model="name" />
          <br /><br />
          <a-row
            class="ingredient-item"
            v-for="(ing, index) in menu_ingredient"
            :key="index"
          >
            <a-col :span="12">
              <a-select
                default-value="ml"
                v-model="ing.ingredient_id"
                style="width: 100%"
              >
                <a-select-option
                  v-for="(item, index) in inventory"
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
                v-model="ing.quantity"
              /><br /><br />
            </a-col>
            <a-col :span="3">
              <a-button type="danger" @click="deleteIngredient(index, ing.id)">
                X
              </a-button>
            </a-col>
          </a-row>

          <a-button type="default" @click="tambahBahan">Tambah Bahan</a-button>
          <br /><br />
          <a-button @click="cancelAdd" type="default" style="margin-right: 10px"
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
      menu: null,
      menu_ingredient: null,
      cabang: null,
      name: null,
      inventory: null,
    };
  },
  async mounted() {
    this.itemId = this.$route.params.id;
    this.cabang = JSON.parse(localStorage.getItem("cabang"));
    this.getMenu();
    this.getInventory();
  },
  methods: {
    cancelAdd() {
      this.$router.push(`/menu`);
    },
    tambahBahan() {
      // membuat objek baru berdasarkan data yang diinputkan user
      const newIngredient = {
        menu_id: this.menu.id,
        ingredient_id: "",
        quantity: "",
      };

      // menambahkan objek baru ke dalam array
      this.menu_ingredient.push(newIngredient);
      console.error("menu_ingredient", this.menu_ingredient);
    },
    async deleteIngredient(index, id) {
      // menghapus item dari array berdasarkan index
      this.menu_ingredient.splice(index, 1);
      const { error } = await supabase.from("menu_ingredient").delete().eq("id", id);
      if (error) {
        console.error(" err delete menu_ingredient", error);
      }
    },
    async getMenu() {
      const { data, error } = await supabase
        .from("menu")
        .select("*")
        .eq("id", this.itemId);

      if (error) {
        console.log("Error get Menu", error);
      } else if (data && data.length > 0) {
        this.menu = data[0]; // assuming only one employee is returned
        console.error("menu", this.menu);
        this.name = this.menu.name;
        const { data: menuIngredients, error } = await supabase
          .from("menu_ingredient")
          .select("*")
          .eq("menu_id", this.menu.id);
        this.menu_ingredient = menuIngredients;
        if (error) {
          console.error(" err menu_ingredient", error);
        } else {
          console.error("menu_ingredient", this.menu_ingredient);
        }
      } else {
        console.log("No matching menu found");
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
    async handleEdit() {
      const { data, error } = await supabase
        .from("menu")
        .upsert({
          id: this.menu.id,
          name: this.name,
          id_cabang: this.cabang.id,
        })
        .select();
      if (error) {
        console.log("err handle add", error);
      } else if (data && data.length > 0) {
        for (let i = 0; i < this.menu_ingredient.length; i++) {
          const { error } = await supabase
            .from("menu_ingredient")
            .upsert(this.menu_ingredient[i]);
          if (error) {
            console.error(`Error upserting data[${i}]:`, error);
          } else {
            console.error(`Upserted data[${i}] successfully!`);
          }
        }
        this.$success({
          title: "Berhasil Merubah Menu",
          // JSX support
          content: (
            <div>
              <p>Berhasil Merubah Menu</p>
            </div>
          ),
        });
        this.$router.push(`/menu`);
      } else {
        console.log("err handle add");
      }
    },
  },
};
</script>

<style lang="scss"></style>
