import { createPortal } from 'react-dom';

export default function PortalTarget({ targetEl, children, id }) {
	targetEl.setAttribute('id', id);
	return createPortal(children, targetEl);
}
