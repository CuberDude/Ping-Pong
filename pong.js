


class Vector{
	constructor(x = 0,y = 0){
		this.x =x;
		this.y =y;			
	}
	get length(){
		return Math.sqrt(this.x*this.x + this.y*this.y)
	}
	set length(value){
		const factor = value /this.length;
		this.x = this.x *factor;
		this.y = this.y *factor;
	}
}

class Rect{
	constructor(width, height){
		this.pos = new Vector();
		this.size = new Vector(width,height);
	}
	 get left()
	    {
	        return this.pos.x - this.size.x / 2;
	    }
	    get right()
	    {
	        return this.pos.x + (this.size.x / 2);
	    }
	    get top()
	    {
	        return this.pos.y - this.size.y / 2;
	    }
	    get bottom()
	    {
	        return this.pos.y + this.size.y / 2;
	}
}
class Ball extends Rect{
	constructor(){
		super(10,10);
		this.velocity = new Vector(100,100);
	}
}

class Player extends Rect{
	constructor(){
		super(20,100);
		this.score = 0;
		this.velocityy=0;
	}
}

function draw(th,rect){
	th._context.fillStyle = '#FFF';
	th._context.fillRect(rect.left,rect.top,rect.size.x,rect.size.y);
}

class Pong{
	constructor(canvas){
		this._canvas = canvas;
		this._context = canvas.getContext('2d');	
		this.ball = new Ball;

		this.reset();

		this.players = [
			new Player(),
			new Player()
		];
		this.players[0].pos.x=40;
		this.players[1].pos.x= this._canvas.width -40;
		this.players.forEach(player => player.pos.y = this._canvas.height/2);
		let lastime = null;
		const callback = (millisec) =>{
			if(lastime) {
				if(this.update((millisec - lastime)/1000) === 0)
					return

			}		
			lastime = millisec;
			requestAnimationFrame(callback)
		}
		callback();	
		this.CHAR_PIXEL = 10;		//pixel sze
        this.CHARS = [				//number 0 -9
            '111101101101111',
            '010010010010010',
            '111001111100111',
            '111001111001111',
            '101101111001001',
            '111100111001111',
            '111100111101111',
            '111001001001001',
            '111101111101111',
            '111101111001111',
        	].map(str => {
            const canvas = document.createElement('canvas');
            const s = this.CHAR_PIXEL;
            canvas.height = s * 5;//this canvas is 3x5
            canvas.width = s * 3;
            const context = canvas.getContext('2d');
            context.fillStyle = '#fff';
            str.split('').forEach((fill, i) => {
                if (fill === '1') {
                    context.fillRect((i % 3) * s, (i / 3 | 0) * s, s, s);
                }
            });
            return canvas;
		});

	}

    scoreDraw()
    {
        const align = this._canvas.width / 3;
        const cw = this.CHAR_PIXEL * 4;
        this.players.forEach((player, index) => {
            const chars = player.score.toString().split('');
            const offset = align * (index + 1) - (cw * chars.length / 2) + this.CHAR_PIXEL / 2;
            chars.forEach((char, pos) => {
                this._context.drawImage(this.CHARS[char|0], offset + pos * cw, 20);
            });
        });
	}

	canvasdraw(){
		this._context.fillStyle = '#000';
		this._context.fillRect (0 ,0 ,this._canvas.width ,this._canvas.height);
	}
	gamedraw(){
		draw(this,this.ball);//drawng ball
		this.players.forEach(player => draw(this,player));
		this.scoreDraw();

	}
	reset(){
		this.ball.pos.x=this._canvas.width/2;
		this.ball.pos.y=this._canvas.height/2;
		this.ball.velocity.x=0;
		this.ball.velocity.y=0;
	}
	start(){
		if(this.ball.velocity.x === 0 && this.ball.velocity.y === 0){
			this.ball.velocity.x=300 * (Math.random()>.5 ? -1: 1 );
			this.ball.velocity.y=300 * (Math.random()>.5 ? -1: 1 );	
			this.ball.velocity.length = 200;

		}
	}
	collide(player, ball){
		if(player.left < ball.right && player.right > ball.left && 
			player.top < ball.bottom && player.bottom > ball.top){
			ball.velocity.x *=-1;//changing direction if the paddle touches the ball
			ball.velocity.length *=1.05;//inc velocity
		}
	}
	update(dt) {
		this.ball.pos.x += this.ball.velocity.x*dt;
		this.ball.pos.y += this.ball.velocity.y*dt;
		// body...
		if(this.ball.left <0 || this.ball.right>=this._canvas.width){
			const playerId = this.ball.velocity.x<0 | 0;
			this.players[playerId].score++;
			this.reset();
		}
		if((this.ball.top<0) || (this.ball.bottom>= this._canvas.height))
				this.ball.velocity.y *=-1;
		this.players[1].pos.y = this.ball.pos.y;	
		this.players.forEach(player => this.collide(player,this.ball))
		this.canvasdraw()
		this.gamedraw()
	}
}

const canvas = document.getElementById('pong');
const pong = new Pong(canvas);

pong.canvasdraw();

draw(pong,pong.ball)//drawng ball

canvas.addEventListener('mousemove',event =>{
	const scale = event.offsetY/event.target.getBoundingClientRect().height;
	pong.players[0].pos.y = canvas.height * scale;

});

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    // Take the user to a different screen here.
	
	canvas.addEventListener('click',event =>{
		const scale = event.offsetY/event.target.getBoundingClientRect().height;
		pong.players[0].pos.y = canvas.height * scale;
	});

}

canvas.addEventListener('click',event =>{
	pong.start();
});
