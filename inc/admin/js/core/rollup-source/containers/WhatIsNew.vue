<template>
	<transition name="wptb-fade" appear @after-leave="closeWindow">
		<div class="wptb-what-is-new-container" v-if="windowVisibility">
			<div class="wptb-what-is-new-window wptb-plugin-filter-box-shadow-md">
				<div class="wptb-what-is-new-header">
					<div class="wptb-what-is-new-header-version">
						<span class="wptb-what-is-new-header-text-icon" v-html="icons.lightbulb"></span> Version
						{{ version }}
					</div>
					<div
						class="wptb-what-is-new-header-close"
						@click="setWindowVisibility(false)"
						v-html="icons.times"
					></div>
				</div>
				<div class="wptb-what-is-new-content">
					<div class="wptb-what-is-new-note-image-carousel">
						<div
							:disabled="!navStatus.decrement"
							class="wptb-what-is-new-carousel-nav-button"
							v-html="icons.chevronLeft"
							@click.prevent.capture="modifyIndex(-1)"
						></div>
						<div class="wptb-what-is-new-images-wrapper">
							<transition name="wptb-fade" v-for="({ image, isPro }, index) in notes" :key="index">
								<div
									class="wptb-what-is-new-image-background"
									:data-last="index === notes.length - 1"
									v-show="currentNoteIndex === index"
								>
									<div class="wptb-what-is-new-pro-indicator" v-if="isPro">
										<div class="wptb-what-is-new-pro-indicator-text wptb-plugin-box-shadow-md">
											PRO
										</div>
										<div class="wptb-what-is-new-pro-indicator-triangle-end"></div>
									</div>
									<img class="wptb-plugin-filter-box-shadow-md" :src="image" />
								</div>
							</transition>
						</div>
						<div
							:disabled="!navStatus.increment"
							class="wptb-what-is-new-carousel-nav-button"
							v-html="icons.chevronRight"
							@click.prevent.capture="modifyIndex(1)"
						></div>
					</div>
					<div class="wptb-what-is-new-note-index">{{ currentNoteIndex + 1 }}/{{ totalNotes }}</div>
					<div class="wptb-what-is-new-note-text-container">
						<transition name="wptb-fade" v-for="({ text }, index) in notes" :key="index">
							<div
								class="wptb-what-is-new-note-text"
								v-show="currentNoteIndex === index"
								v-html="text"
							></div>
						</transition>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import 'regenerator-runtime/runtime';

export default {
	props: {
		notes: {
			type: Array,
			default: () => {
				return [];
			},
		},
		version: {
			type: String,
			default: '1.0.0',
		},
	},
	data() {
		return {
			icons: {
				lightbulb: null,
				times: null,
				chevronRight: null,
				chevronLeft: null,
			},
			windowVisibility: true,
			currentNoteIndex: 0,
		};
	},
	async mounted() {
		this.icons.lightbulb = await WPTB_IconManager.getIcon('lightbulb', null, true);

		this.icons.times = await WPTB_IconManager.getIcon('times', null, true);

		this.icons.chevronLeft = await WPTB_IconManager.getIcon('chevron-left', null, true);

		this.icons.chevronRight = await WPTB_IconManager.getIcon('chevron-right', null, true);
	},
	computed: {
		totalNotes() {
			return this.notes.length;
		},
		currentNoteText() {
			return this.notes[this.currentNoteIndex].text;
		},
		navStatus() {
			return { decrement: this.currentNoteIndex > 0, increment: this.currentNoteIndex + 1 < this.notes.length };
		},
	},
	methods: {
		closeWindow() {
			// remove mounted element
			this.$root.$el.remove();
			// destroy main vue instance
			this.$root.$destroy();
		},
		setWindowVisibility(state) {
			this.windowVisibility = state;
		},
		limitToRange(val) {
			// eslint-disable-next-line no-nested-ternary
			return val < 0 ? 0 : val >= this.notes.length ? this.notes.length - 1 : val;
		},
		modifyIndex(value) {
			this.currentNoteIndex = this.limitToRange(this.currentNoteIndex + value);
		},
	},
};
</script>
