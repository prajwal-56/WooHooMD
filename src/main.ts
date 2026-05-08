import { Plugin } from 'obsidian';

export default class WooHooPLugin extends Plugin {
	async onload() {
		console.log("WoooHooo ! it loaded ")

		this.registerDomEvent( document , 'click' , async (event: MouseEvent) =>{
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

			var gifPath = ".obsidian/plugins/woo-hoo/gifs/";
			const files = await this.app.vault.adapter.list(gifPath);
			const gifFiles = files.files
			console.log(files);

			const randomGif: any = gifFiles[Math.floor(Math.random() * gifFiles.length)];
			gif.src = this.app.vault.adapter.getResourcePath(randomGif);

			
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