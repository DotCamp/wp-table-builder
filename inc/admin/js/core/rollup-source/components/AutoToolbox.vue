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
				<label for="wptbTopRowHeader"> {{ strings.topRowHeader | cap }}: </label>
				<pop-up :message="strings.topRowHeaderHelp">?</pop-up>
			</responsive-controls-row>
			<responsive-controls-row>
				<label for="wptbStackDirection"> {{ strings.stackDirection | cap }}:</label>
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
			<responsive-controls-row>
				<number-postfix-input
					class="wptb-size-input"
					:enable-dynamic-width="true"
					v-model="directives.modeOptions.auto.cellsPerRow[sizeRange.id]"
					:min="1"
					:max="100"
					:enable-limit="true"
					:disabled="context.isDisabled()"
					id="cellsPerRow"
				></number-postfix-input>
				<label for="cellsPerRow"> {{ strings.cellsPerRow | cap }}</label>
				<pop-up :message="strings.cellsPerRowHelp">?</pop-up>
			</responsive-controls-row>
			<responsive-controls-row>
				<input
					type="checkbox"
					id="wptbResponsivePreserveColor"
					v-model="directives.preserveRowColor"
					:disabled="context.isDisabled()"
				/>
				<label for="wptbResponsivePreserveColor">{{ strings.preserveRowColor | cap }}</label>
				<pop-up :message="strings.preserveRowColorHelp">?</pop-up>
			</responsive-controls-row>
		</template>
	</responsive-dynamic-toolbox>
</template>
<script>
import ResponsiveDynamicToolbox from './ResponsiveDynamicToolbox';
import PopUp from './PopUp';
import NumberPostfixInput from './NumberPostfixInput';

export default {
	props: {
		sizeRange: Object,
	},
	components: { NumberPostfixInput, ResponsiveDynamicToolbox, PopUp },
};
</script>
