import { Plugin } from 'obsidian';

export default class WooHooPLugin extends Plugin {
	async onload() {
		console.log("WoooHooo ! it loaded ")

		this.registerDomEvent( document , 'click' , (event: MouseEvent) =>{
			// console.log("the user clicked smth. woohoo" , event.target);
			
			const target = event.target as HTMLElement;
			
			// ignore the clicks that aren't checkbox clicks  
			if( !target.matches('input.task-list-item-checkbox')) return;

			// a checked box belongs to class 'is-checked' 
			const isChecked = target.parentElement?.classList.contains('is-checked')
		
			// it might not be updated yet, so we check for the opposite of checked
			if(isChecked) return; 
		
			console.log("It's checked. yay 🎉")

			// renders the gif
			const gif = document.createElement('img');
			gif.src = 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNW5kb2pqbmdwcHR3amZuNjJ0OTZobmFoeXBpamlqczVrczgwY3kzaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bpTL6wXRuMQpMIVduB/giphy.gif';
			gif.style.position = 'fixed';
			// gif.style.width = '250px';
			gif.style.top = '50%';
			gif.style.left = '50%';
			gif.style.transform = 'translate( -50% , -50%)';
			gif.style.zIndex = '9999';


			document.body.appendChild(gif);

			setTimeout(() => {
				document.body.removeChild(gif);
			} , 5000);

	
		});

	// onunload() {
	// 	console.log(" uhh oh. It's unloaded :(")
	// }
}
}