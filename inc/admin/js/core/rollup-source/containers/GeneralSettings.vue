<template>
	<fragment>
		<menu-content>
			<setting-card v-for="field in currentFields" :key="field.id" :title="field.title || field.label">
				<control-item :field-data="field" :modelBind="store"></control-item>
			</setting-card>
		</menu-content>
		<footer-buttons>
			<menu-button type="danger" :disabled="disabled" @click="$emit('resetStore')"
				>{{ strings.revert }}
			</menu-button>
			<menu-button type="primary" :disabled="disabled" @click="$emit('submitSettings')"
				>{{ strings.submit }}
			</menu-button>
		</footer-buttons>
	</fragment>
</template>
<script>
import { Fragment } from 'vue-fragment';
import SettingCard from '../components/SettingCard';
import ControlItem from '../components/ControlItem';
import MenuContent from '../components/MenuContent';
import MenuButton from '../components/MenuButton';
import FooterButtons from '../components/Settings/FooterButtons';

export default {
	props: {
		currentFields: {
			type: Array,
			default: () => {
				return [];
			},
		},
		store: {
			type: Object,
			default: () => {
				return {};
			},
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	components: { SettingCard, ControlItem, MenuContent, Fragment, MenuButton, FooterButtons },
};
</script>
