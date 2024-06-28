const axios = require('axios');
const cheerio = require('cheerio');

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }

function realAnswers(){
    return new Promise((resolve, reject) => {
    let returnValue = [];
    axios.get('https://www.miejski.pl/losuj') .then(response => {
        const $ = cheerio.load(response.data);
        const h1 = $('main article header h1').text();
        const h2 = $('main article p').text();
        if (h1 && h2) {
            returnValue = [h1, h2];
        } else {
            console.log(`Nie udało się pobrać pytania.`);
        }
    }).catch(error => {
        console.log(error);
    });
    setTimeout(() => { resolve(returnValue) }, 1000)
});}

function fakeAnswers(num){ 
    return new Promise((resolve, reject) => {
        let returnValue = [];
        for (let i = 1; i <= num; i++){
            axios.get('https://www.miejski.pl/losuj').then(response => {
                const $ = cheerio.load(response.data);
                const h1 = $('main article p').text();
                returnValue.push(h1);
            }).catch(error => {
                console.log(error);
            })
        }
        setTimeout(() => { resolve(returnValue) }, 1000)
});}

function createQuestion() { 

    fakeAnswers(3).then((res0) => {
        res0[0] = res0[0].trim();
        res0[1] = res0[1].trim();
        res0[2] = res0[2].trim();
        let questionanswers = res0;

        realAnswers().then((res1) => {
            setTimeout(() => {
                questionanswers.push(res1[1]);
                let question = res1[0];
                shuffle(questionanswers);
                console.log(`
                PYTANIE:
                ${question}
                ODPOWIEDZI:
                1. ${questionanswers[0]}
                2. ${questionanswers[1]}
                3. ${questionanswers[2]}
                4. ${questionanswers[3]}
                `);
            }, 1000)
        })

    })

}


// end

createQuestion()

