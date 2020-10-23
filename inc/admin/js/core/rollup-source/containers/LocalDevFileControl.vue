<template>
	<div class="wptb-settings-row wptb-settings-middle-xs wptb-plugin-width-full wptb-flex wptb-justify-content-center">
		<menu-button @click="setFrameOpenStatus(true)">
			Plugin Local Images
		</menu-button>
		<transition name="wptb-fade">
			<div v-if="frameOpenStatus" class="wptb-local-dev-file-chooser">
				<div class="wptb-local-dev-modal">
					<div class="wptb-local-dev-modal-header">
						<div class="wptb-local-dev-modal-title">
							Plugin Images
						</div>
						<div @click.prevent="setFrameOpenStatus(false)" class="wptb-local-dev-modal-close">
							X
						</div>
					</div>
					<div class="wptb-local-dev-modal-files">
						<local-image-card
							v-for="(url, name) in innerImages"
							:key="url"
							:name="name"
							:url="url"
							:active-card="cardLimbo.name"
							@cardSelected="handleCardSelect"
						></local-image-card>
					</div>
					<div class="wptb-local-dev-modal-footer">
						<menu-button>refresh</menu-button>
						<menu-button @click="handleSelectButton" :disabled="!cardLimbo.name">select</menu-button>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import ControlBase from '../mixins/ControlBase';
import MenuButton from '../components/MenuButton';
import LocalImageCard from '../components/LocalImageCard';

export default {
	components: { LocalImageCard, MenuButton },
	mixins: [ControlBase],
	props: {
		images: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	data() {
		return {
			frameOpenStatus: false,
			innerImages: [],
			selectedCard: {
				name: null,
				url: null,
			},
			cardLimbo: {
				name: null,
				url: null,
			},
			assignDefaultValueAtMount: true,
		};
	},
	watch: {
		elementMainValue(n) {
			this.basicValueUpdate(n, true);
			this.selectedCard.name = n;
			this.selectedCard.url = this.getImageUrl(n);
		},
		selectedCard: {
			handler(n) {
				this.elementMainValue = n.name;
				this.cardLimbo.name = n.name;
				this.cardLimbo.url = this.getImageUrl(n.name);
				this.selectedCard.url = this.getImageUrl(n.name);

				this.setTargetImage(this.selectedCard.url);
			},
			deep: true,
		},
		frameOpenStatus(n) {
			if (n) {
				document.addEventListener('keydown', (e) => {
					if (e.code === 'Escape') {
						this.setFrameOpenStatus(false);
					}
				});
			}
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.innerImages = this.images;
		});
	},
	methods: {
		setFrameOpenStatus(val) {
			this.frameOpenStatus = val;
		},
		handleCardSelect(name, url) {
			this.cardLimbo.name = name;
			this.cardLimbo.url = url;
		},
		handleSelectButton() {
			this.selectedCard.name = this.cardLimbo.name;
			this.selectedCard.url = this.cardLimbo.url;
			this.setFrameOpenStatus(false);
		},
		getImageUrl(name) {
			let url = null;
			if (this.innerImages[name]) {
				url = this.innerImages[name];
			}
			return url;
		},
		setTargetImage(url) {
			if (url) {
				// eslint-disable-next-line array-callback-return
				this.targetElements.map((elObject) => {
					// eslint-disable-next-line array-callback-return
					elObject.elements.map((el) => {
						let img = el.querySelector('img');
						if (!img) {
							img = document.createElement('img');

							const imageWrapper = el.querySelector('.wptb-image-wrapper a');
							imageWrapper.innerHTML = '';
							imageWrapper.appendChild(img);
						}
						img.setAttribute('src', url);
						img.setAttribute('width', 'auto');
						img.setAttribute('height', 'auto');
					});
				});
			}
		},
	},
};
</script>
