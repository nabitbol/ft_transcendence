import classes from './Backdrop.component.module.css'

function Backdrop(props) {
	return <div className={classes.backdrop} onClick={props.closeBackdrop}/>
}

export default Backdrop