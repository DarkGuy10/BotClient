import styles from './Input.module.scss'

interface InputProps {
	type: 'text'
	placeholder?: string
}

export default function Input({ type, placeholder }: InputProps) {
	return (
		<input
			type={type}
			className={`${type}InputField`}
			placeholder={placeholder}
		/>
	)
}
