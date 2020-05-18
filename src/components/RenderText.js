import React,{useEffect,useState} from 'react';

const RenderText =  ({url}) => {
	
	const [text,setText] = useState('');

	useEffect(() => {
		const text = fetch(url).then(response => response.text())
		setText(text)
	},[])

	return(
		<div>
		<p>{text}</p>
		</div>
	)

}

export default RenderText;