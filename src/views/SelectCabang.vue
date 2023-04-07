<template lang="">
  <div class="cabang-con">
    <div class="item-cabang" v-for="(item, index) in cabang" :key="item.id">
      <div class="nama">
        {{ item.name }}
      </div>
      <div class="alamat">
        {{ item.address }}
      </div>

      <a-button @click="selectCabang(item.id)"> Pilih Cabang </a-button>
    </div>
  </div>
</template>
<script>
import { supabase } from "../lib/supabaseClient";
export default {
  data() {
    return {
      cabang: null,
    };
  },
  async mounted() {
    const { data, error } = await supabase.from("cabang").select("*");

    if (error) {
      console.error("err select cabang", error);
    } else {
      console.error("cabang", data);
      this.cabang = data;
    }
  },
  methods: {
    async selectCabang(id){
        const { data, error } = await supabase
            .from("cabang")
            .select("*")
            .eq("id", id)

          if (error) {
            console.log("Error selectCabang", error);
          } else if (data && data.length > 0) {
            const cabang = data[0]; // assuming only one employee is returned
            console.error('Semangat ya kerja di',cabang);

            // save employee data without password to local storage
            localStorage.setItem("cabang", JSON.stringify(cabang));
            // redirect to dashboard
            this.$router.push("/dashboard");
          } else {
            console.log("No matching cabang found");
          }
    }
  },
};
</script>
<style>
.cabang-con {
  padding: 30px;
}
.item-cabang {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
  text-align: center;
}
.item-cabang .nama {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 10px;
}
.item-cabang .alamat {
  margin-bottom: 20px;
}

.item-cabang button {
  width: 100% !important;
}
</style>
