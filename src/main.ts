import { Plugin } from 'obsidian';
import { WooHooSettings, DEFAULT_SETTINGS, WooHooSettingTab } from "./settings";


export default class WooHooPLugin extends Plugin {
	settings!: WooHooSettings;

	// Determine the duration from Graphic Control Extension (reffer : https://en.wikipedia.org/wiki/GIF#:~:text=Graphic%20Control%20Extension,-30D)
	getGifDuration(buffer: ArrayBuffer): number {
		const bytes = new Uint8Array(buffer);
		let duration = 0;
		let pos = 13; // pointer - skips the header (headers takes up 13 bytes )  
		
		if( (bytes[10] & 0x80) !== 0 ){
			pos += 3 * Math.pow(2 , (bytes[10] & 0x07) + 1);
		} 

		while (pos < bytes.length){
			const block = bytes[pos];
			if(block === 0x21){
				if (bytes[pos + 1] === 0xF9){
					const delay = bytes[pos + 4] + (bytes[pos + 5] << 8);
					duration += delay * 10;
				}
				pos += 2 + 1 + bytes[pos + 2] + 1;
			}
			else if(block === 0x2C){
				pos += 10;
				while (bytes[pos] !== 0) {pos += bytes[pos] + 1;}
				pos++;
			}
			else if (block === 0x3B) break;
			else break;
		}

		if (duration >= 60000) duration = 60000; // max duration = 60 seconds 
		return duration;
	}
	
	async onload() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		this.addSettingTab(new WooHooSettingTab(this.app, this));

		if(this.settings.duration == null || this.settings.duration == undefined ){
			this.settings.duration = DEFAULT_SETTINGS.duration
		}

		this.registerDomEvent( document , 'click' , async (event: MouseEvent) =>{
			
			const target = event.target as HTMLElement;
			
			// ignore the clicks that aren't checkbox clicks  
			if( !target.matches('input.task-list-item-checkbox')) return;

			// a checked box belongs to class 'is-checked' 
			const isChecked = target.parentElement?.classList.contains('is-checked')
		
			// it might not be updated yet, so we check for the opposite of checked
			if(isChecked) return; 
		

			// renders the gif
			const gif = document.createElement('img');
			gif.classList.add('woohoo-gif');

			var gifPath = this.settings.gifFolder;
			
			if(!gifPath) {
				console.log("the gif folder was not set")
				return;
			}
			const files = await this.app.vault.adapter.list(gifPath);
			const gifFiles = files.files

			const randomGif: any = gifFiles[Math.floor(Math.random() * gifFiles.length)];
			gif.src = this.app.vault.adapter.getResourcePath(randomGif);

			const duration = randomGif.endsWith('.gif')
				? this.getGifDuration(await this.app.vault.adapter.readBinary(randomGif))
				: 3000; // default duration for non-gif files 


			// gif.autoplay = true;
			// gif.loop = false;
			// gif.muted = true; // in case
			gif.style.position = 'fixed';
			gif.style.width = this.settings.gifSize + 'px';
			// gif.style.height = this.settings.gifSize + 'px';
			gif.style.top = '50%';
			gif.style.left = '50%';
			gif.style.transform = 'translate( -50% , -50%)';
			gif.style.zIndex = '9999';


			document.body.appendChild(gif);

			// mild fade-in effect 
			setTimeout(() => gif.classList.add('visible'), 300);

			const final_duration = (duration || this.settings.duration )

			// console.log('settings duration:', this.settings.duration);
			// console.log('gif duration:', duration);
			// console.log('final duration:', final_duration);

			//mild fade-out effect
			setTimeout(() => {
				gif.classList.remove('visible');
				setTimeout(() => {
					if (document.body.contains(gif)) {
						document.body.removeChild(gif);
					}
				}, 3000);
			// }, 30000);
			} , final_duration );
		});

	}
	onunload() {
		console.log(" uhh oh. It's unloaded :(")
	}
}
