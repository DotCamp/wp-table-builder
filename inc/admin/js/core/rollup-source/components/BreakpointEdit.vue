<template>
	<div>
		<div>
			<div ref="toggleControl" style="cursor: pointer;">toggleControl</div>
			<div ref="toggleTarget" class="wptb-responsive-breakpoint-edit-wrapper">
				<label>Desktop</label>
				<number-postfix-input
					:enable-dynamic-width="true"
					class="wptb-size-input"
					post-fix="px"
				></number-postfix-input>
				<label>Tablet</label>
				<number-postfix-input
					:enable-dynamic-width="true"
					class="wptb-size-input"
					post-fix="px"
				></number-postfix-input>
				<label>Mobile</label>
				<number-postfix-input
					:enable-dynamic-width="true"
					class="wptb-size-input"
					post-fix="px"
				></number-postfix-input>
			</div>
		</div>
	</div>
</template>
<script>
import NumberPostfixInput from './NumberPostfixInput';

export default {
	components: { NumberPostfixInput },
	mounted() {
		const { toggleControl, toggleTarget } = this.$refs;
		toggleControl.addEventListener('click', () => {
			jQuery(toggleTarget).slideToggle();
		});
	},
};
</script>
