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
						<empty-cover v-if="isImagesEmpty">
							no plugin images found...
						</empty-cover>
						<empty-cover v-if="fetching" style="color: red; background-color: rgba(0, 0, 0, 0.4);">
							fetching images...
						</empty-cover>
					</div>
					<div class="wptb-local-dev-modal-footer">
						<menu-button :disabled="fetching" @click="getLocalImages">refresh</menu-button>
						<menu-button :disabled="fetching" @click="handleSelectButton" :disabled="!cardLimbo.name"
							>select</menu-button
						>
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
import EmptyCover from '../components/EmptyCover';

export default {
	components: { EmptyCover, LocalImageCard, MenuButton },
	mixins: [ControlBase],
	props: {
		images: {
			type: null,
			default: () => {
				return {};
			},
		},
		security: {
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
			mutationObserver: null,
			fetching: false,
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

			const imageElement = document.querySelector(`.${this.elemContainer}`);

			// observe image element src changes since button control don't fire necessary global events to track with WPTB_Helper.controlsInclude
			this.mutationObserver = new MutationObserver(this.mutationCallback);
			this.mutationObserver.observe(imageElement, { attributes: true, childList: true, subtree: true });
		});
	},
	beforeDestroy() {
		if (this.mutationObserver) {
			this.mutationObserver.disconnect();
		}
	},
	computed: {
		isImagesEmpty() {
			return (
				!Object.keys(this.innerImages).filter((e) => Object.prototype.hasOwnProperty.call(this.innerImages, e))
					.length > 0
			);
		},
	},
	methods: {
		getLocalImages() {
			const ajaxUrl = new URL(this.security.ajaxUrl);
			ajaxUrl.searchParams.append('nonce', this.security.nonce);
			ajaxUrl.searchParams.append('action', this.security.action);

			this.fetching = true;
			fetch(ajaxUrl.toString())
				// eslint-disable-next-line consistent-return
				.then((r) => {
					if (r.ok) {
						return r.json();
					}
					throw new Error('an error occured');
				})
				.then((resp) => {
					if (resp.error) {
						throw new Error(resp.error);
					}
					this.innerImages = resp.data.images;
				})
				.catch((err) => {
					console.error(err);
				})
				.finally(() => {
					this.fetching = false;
				});
		},
		mutationCallback(mutations) {
			// eslint-disable-next-line array-callback-return
			Array.from(mutations).map((m) => {
				if (m.target && m.target.nodeName === 'IMG' && m.attributeName === 'src') {
					if (m.target.getAttribute('src') !== this.selectedCard.url) {
						this.resetSelectedLocalFile();
					}
				}
			});
		},
		resetSelectedLocalFile() {
			this.selectedCard.name = '';
			this.selectedCard.url = '';
		},
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
			if (url !== null && url !== '') {
				// eslint-disable-next-line array-callback-return
				this.targetElements.map((elObject) => {
					// eslint-disable-next-line array-callback-return
					elObject.elements.map((el) => {
						// remove placeholder class else img will not be visible at frontend
						el.classList.remove('wptb-elem-placeholder');

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
