<template>
  <div>
    <h1>Login</h1>
    <input v-model="name" />
  </div>
</template>

<script>
export default {
  name: "Login",
  data: () => ({
    name: undefined
  })
};
</script>
