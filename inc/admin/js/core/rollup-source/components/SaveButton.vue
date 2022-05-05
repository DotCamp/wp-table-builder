<template>
	<div class="main-save-button-wrapper">
		<a href="#" class="wptb-save-btn wptb-save-disabled wptb-settings-section-item static-active"> Save </a>
		<div class="wptb-busy">
			<div class="wptb-busy-circle"></div>
			<div class="wptb-busy-circle"></div>
			<div class="wptb-busy-circle"></div>
		</div>
		<div class="wptb-save-button-down">
			<icon name="caret-down"></icon>
		</div>
	</div>
</template>

<script>
import Icon from '$Components/Icon';

export default {
	components: { Icon },
};
</script>
