(function() {
    class Inspector {

        constructor(sd) {
            this.sd = sd;
            this.container = document.querySelector('.inspector');
            this.ul = document.createElement('UL')
        }

        create() {
            this.container.appendChild(this.ul);
            this.update();
        }

        update() {
            this.ul.innerHTML = "";
            this.sd.elements.forEach((el, index) => {

                let li = document.createElement('LI');
                li.addEventListener('click', () => {
                    el.removeFromWorld();
                    this.sd.elements.splice(index, 1);
                    this.update();
                })
                li.textContent = el.label + " " + index;
                this.ul.appendChild(li);
            });

        }
    }

    window.GS.SD.Inspector = Inspector;
}())