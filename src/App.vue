<template>
  <div id="app">
    <!-- <Nav/> -->
    <router-view ></router-view>
  </div>
</template>

<script>
// import Nav from '@/components/Nav'
export default {
  name: 'App',
  components: {
    // Nav
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 30px; */
}

.todo {
  margin-top: 100px;
}

.todo_input {
  margin: 10px;
  padding: 10px;
  width: 30%;
}

</style>
