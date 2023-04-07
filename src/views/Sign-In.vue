<!-- 
	This is the sign in page, it uses the dashboard layout in: 
	"./layouts/Default.vue" .
 -->

<template>
  <div class="sign-in">
    <a-row type="flex" :gutter="[24, 24]" justify="space-around" align="middle">
      <!-- Sign In Form Column -->
      <a-col
        :span="24"
        :md="12"
        :lg="{ span: 12, offset: 0 }"
        :xl="{ span: 6, offset: 2 }"
        class="col-form"
      >
        <h1 class="mb-15">Sign In</h1>

        <!-- Sign In Form -->
        <a-form
          id="components-form-demo-normal-login"
          :form="form"
          class="login-form"
          @submit="handleSubmit"
          :hideRequiredMark="true"
        >
          <a-form-item class="mb-10" label="Username" :colon="false">
            <a-input
              v-decorator="[
                'username',
                {
                  rules: [
                    { required: true, message: 'Please input your email!' },
                  ],
                },
              ]"
              placeholder="username"
            />
          </a-form-item>
          <a-form-item class="mb-5" label="Password" :colon="false">
            <a-input
              v-decorator="[
                'password',
                {
                  rules: [
                    { required: true, message: 'Please input your password!' },
                  ],
                },
              ]"
              type="password"
              placeholder="Password"
            />
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              block
              html-type="submit"
              class="login-form-button"
            >
              SIGN IN
            </a-button>
          </a-form-item>
        </a-form>
        <!-- / Sign In Form -->
      </a-col>
      <!-- / Sign In Form Column -->
    </a-row>
  </div>
</template>

<script>
import { supabase } from "../lib/supabaseClient";
export default {
  data() {
    return {
      // Binded model property for "Sign In Form" switch button for "Remember Me" .
      rememberMe: true,
    };
  },
  beforeCreate() {
    // Creates the form and adds to it component's "form" property.
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },
  methods: {
    // Handles input validation after submission.
    async handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        if (!err) {
          const { data, error } = await supabase
            .from("employee")
            .select("*")
            .eq("username", values.username)
            .eq("password", values.password);

          if (error) {
            console.log("Username Atau Password Salah", error);
          } else if (data && data.length > 0) {
            const employee = data[0]; // assuming only one employee is returned
            console.log(employee);
            // Create a new object without the "password" field
            const user = { ...employee };
            delete user.password;
            delete user.created_at;
            delete user.updated_at;

            // save employee data without password to local storage
            localStorage.setItem("user", JSON.stringify(user));
            // redirect to dashboard
            this.$router.push("/select-cabang");
          } else {
            console.log("No matching employee found");
          }
        }
      });
    },
  },
};
</script>

<style lang="scss">
body {
  background-color: #ffffff;
}
</style>
