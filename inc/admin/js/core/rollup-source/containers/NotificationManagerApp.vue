<template>
	<i>{{ count }}</i>
</template>

<script>
import { mapState } from 'vuex';

export default {
	computed: mapState(['count']),
};
</script>
