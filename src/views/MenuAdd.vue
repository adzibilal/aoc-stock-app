<template>
    <div>
        <!-- Authors Table -->
        <a-row :gutter="24" type="flex">
            <a-col :span="24">
                <a-card>
                    <h5>Tambah Menu</h5>
                    <a-input placeholder="Nama Menu" v-model="name" />
                    <br /><br />

                    <a-row
                        class="ingredient-item"
                        v-for="(ing, index) in ingredients"
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
                            <a-button
                                type="danger"
                                @click="deleteIngredient(index)"
                            >
                                X
                            </a-button>
                        </a-col>
                    </a-row>

                    <a-button type="default" @click="tambahBahan"
                        >Tambah Bahan</a-button
                    >
                    <br /><br />
                    <a-button
                        @click="cancelAdd"
                        type="default"
                        style="margin-right: 10px"
                        >Batal</a-button
                    >
                    <a-button @click="handleAdd()" type="primary">
                        Simpan
                    </a-button>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import { supabase } from '../lib/supabaseClient';
import { Modal } from 'ant-design-vue';
export default {
    data() {
        return {
            itemId: null,
            inventory: null,
            name: null,
            quantity: null,
            unit: null,
            cabang: null,
            ingredients: [{ ingredient_id: '', quantity: '' }],
        };
    },
    async mounted() {
        this.itemId = this.$route.params.id;
        this.cabang = JSON.parse(localStorage.getItem('cabang'));
        this.getInventory();
        console.error('ingredients', this.ingredients);
    },
    methods: {
        cancelAdd() {
            this.$router.push(`/menu`);
        },
        tambahBahan() {
            // membuat objek baru berdasarkan data yang diinputkan user
            const newIngredient = {
                ingredient_id: '',
                quantity: '',
            };

            // menambahkan objek baru ke dalam array
            this.ingredients.push(newIngredient);
        },
        deleteIngredient(index) {
            // menghapus item dari array berdasarkan index
            this.ingredients.splice(index, 1);
        },
        async getInventory() {
            this.cabang = JSON.parse(localStorage.getItem('cabang'));

            const { data, error } = await supabase
                .from('ingredient')
                .select('*')
                .eq('id_cabang', this.cabang.id);

            if (error) {
                console.log('Error get Ingridient', error);
            } else if (data && data.length > 0) {
                this.inventory = data; // assuming only one employee is returned
                console.error('inventory', this.inventory);
            } else {
                console.log('No matching cabang found');
            }
        },
        async handleAdd() {
            const { data, error } = await supabase
                .from('menu')
                .insert({ name: this.name, id_cabang: this.cabang.id })
                .select();
            if (error) {
                console.log('err handle add', error);
            } else if (data && data.length > 0) {
                const menuId = data[0].id;
                const ingredientsWithMenuId = this.ingredients.map(
                    (ingredient) => ({
                        ...ingredient,
                        menu_id: menuId,
                    }),
                );

                console.error('ingredientsWithMenuId', ingredientsWithMenuId);

                const { error } = await supabase
                    .from('menu_ingredient')
                    .insert(ingredientsWithMenuId);
                if (error) {
                    console.error('err handle add menu_ingredient', error);
                } else {
                    console.error('berhasil');
                    this.$router.push(`/menu`);
                }
            } else {
                console.log('err handle add');
            }
        },
    },
};
</script>

<style lang="scss"></style>
