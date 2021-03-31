<template>
	<div class="wptb-data-display-header-button-container">
		<div class="wptb-data-display-header-button-container-left" data-button-position="left">
			<slot name="left"></slot>
		</div>
		<div class="wptb-data-display-header-button-container-right" data-button-position="right">
			<slot name="right"></slot>
		</div>
	</div>
</template>

<script>
export default {};
</script>
