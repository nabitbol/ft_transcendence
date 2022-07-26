function Modal(props) {
	return (
		<div className='modal'>
			<p>Are you sure ?</p>
			<button className='btn' onClick={props.closeModal}>Cancel</button>
			<button className='btn btn--alt' onClick={() => { props.removeFunction(); props.closeModal();}}>Yes</button>
		</div>
	)
}

export default Modal