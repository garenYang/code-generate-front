<template>
  <div>
    <transition name="slide-fade" mode="out-in">
<!--      <keep-alive include="PrdTable">-->
<!--        <router-view></router-view>-->
<!--      </keep-alive>-->
      <keep-alive include="PrdList">
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>
