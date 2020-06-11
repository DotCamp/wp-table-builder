<template>
	<div class="wptb-responsive-toolbox-wrapper">
		<div class="wptb-responsive-toolbox-top-static wptb-responsive-toolbox-row">
			<div class="wptb-controls-flex-row">
				<input id="wptbResponsiveEnabled" type="checkbox" v-model="directives.responsiveEnabled" />
				<label for="wptbResponsiveEnabled">{{ strings.enableResponsive | cap }}</label>
				<pop-up :message="strings.enableResponsiveHelp">?</pop-up>
			</div>
			<div class="wptb-controls-flex-row">
				<label for="wptbResponsiveMode">{{ strings.mode | cap }}:</label>
				<select
					v-model="directives.responsiveMode"
					id="wptbResponsiveMode"
					:disabled="!directives.responsiveEnabled"
				>
					<option value="auto">{{ strings.auto | cap }}</option>
					<option value="pattern">{{ strings.pattern | cap }}</option>
					<option value="full">{{ strings.full | cap }}</option>
				</select>
				<pop-up :message="strings[`${directives.responsiveMode}Help`]">?</pop-up>
			</div>
		</div>
		<responsive-dynamic-toolbox mode="auto" :range-name="sizeRange">
			<template v-slot:default="{ context }">
				<div class="wptb-controls-flex-row">
					<input
						v-model="directives.modeOptions.auto.topRowAsHeader"
						id="wptbTopRowHeader"
						type="checkbox"
						:disabled="context.isDisabled()"
					/>
					<label for="wptbTopRowHeader"> {{ strings.topRowHeader }}: </label>
					<pop-up :message="strings.topRowHeaderHelp">?</pop-up>
				</div>
				<div class="wptb-controls-flex-row">
					<label for="wptbStackDirection"> {{ strings.stackDirection }}: </label>
					<select
						v-model="directives.modeOptions.auto.cellStackDirection"
						id="wptbStackDirection"
						:disabled="context.isDisabled()"
					>
						<option value="row">{{ strings.row | cap }}</option>
						<option value="column">{{ strings.column | cap }}</option>
					</select>
					<pop-up :message="strings.stackDirectionHelp">?</pop-up>
				</div>
			</template>
		</responsive-dynamic-toolbox>
		<responsive-dynamic-toolbox mode="pattern" :range-name="sizeRange">
			<i>pattern controls</i>
		</responsive-dynamic-toolbox>
		<responsive-dynamic-toolbox mode="full" :range-name="sizeRange">
			<i>full controls</i>
		</responsive-dynamic-toolbox>
	</div>
</template>
<script>
import PopUp from './PopUp';
import ResponsiveDynamicToolbox from './ResponsiveDynamicToolbox';

export default {
	props: {
		sizeRange: Object,
	},
	components: { PopUp, ResponsiveDynamicToolbox },
	methods: {
		isCurrentMode(mode) {
			return this.directives.responsiveMode === mode;
		},
	},
};
</script>
