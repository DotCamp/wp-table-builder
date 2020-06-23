<template>
	<responsive-dynamic-toolbox mode="auto" :range-name="sizeRange">
		<template v-slot:default="{ context }">
			<responsive-controls-row>
				<input
					v-model="directives.modeOptions.auto.topRowAsHeader"
					id="wptbTopRowHeader"
					type="checkbox"
					:disabled="context.isDisabled()"
				/>
				<label for="wptbTopRowHeader"> {{ strings.topRowHeader }}: </label>
				<pop-up :message="strings.topRowHeaderHelp">?</pop-up>
			</responsive-controls-row>
			<responsive-controls-row>
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
			</responsive-controls-row>
		</template>
	</responsive-dynamic-toolbox>
</template>
<script>
import ResponsiveDynamicToolbox from './ResponsiveDynamicToolbox';
import PopUp from './PopUp';

export default {
	props: {
		sizeRange: Object,
	},
	components: { ResponsiveDynamicToolbox, PopUp},
};
</script>
