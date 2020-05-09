<template>
	<div class="wptb-setting-control">
		<div v-if="title" class="title">{{ title }}</div>
		<slot></slot>
	</div>
</template>
<script>
export default {
	props: ['title'],
};
</script>
