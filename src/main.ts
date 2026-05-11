import { Plugin } from 'obsidian';
import { MyPluginSettings } from "./settings";

export default class WooHooPLugin extends Plugin {
	settings!: MyPluginSettings;

	// Determine the duration from Graphic Control Extension (reffer : https://en.wikipedia.org/wiki/GIF#:~:text=Graphic%20Control%20Extension,-30D)
	getGifDuration(buffer: ArrayBuffer): number {
		const bytes: Uint8Array<ArrayBuffer> = new Uint8Array(buffer);
		let duration = 0;
		console.log('the method got called !')

		for( let i = 0; i < bytes.length - 5; i++) {
			if( bytes[i] == 0x21 && bytes[i+1] == 0xF9) {
				const delay = ((bytes[i+4] as number) | ((bytes[i+5] as number) << 8 )) * 10;
				duration += delay;
			}
		}
		return duration;
	}
	
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

			console.log(gifFiles);
			console.log(randomGif);
			console.log("finding the duration of the gif...")
			const duration = randomGif.endsWith('.gif')
				? this.getGifDuration(await this.app.vault.adapter.readBinary(randomGif))
				: 3000; // default duration for non-gif files 

			console.log("duration :" + duration);

			// gif.autoplay = true;
			// gif.loop = false;
			// gif.muted = true; // in case
			gif.style.position = 'fixed';
			// gif.style.width = '250px';
			gif.style.top = '50%';
			gif.style.left = '50%';
			gif.style.transform = 'translate( -50% , -50%)';
			gif.style.zIndex = '9999';


			document.body.appendChild(gif);

			setTimeout(() => {
				document.body.removeChild(gif);
			} , 3000);

	
		});

	// onunload() {
	// 	console.log(" uhh oh. It's unloaded :(")
	// }
}
}