import LottoMachine from '../domain/model/LottoMachine';
import Money from '../domain/model/Money';
import { errorAlert } from '../util/errorAlert';

class WebLottoController {
  start() {
    const $signupForm = document.getElementById('money-form');

    $signupForm.addEventListener('submit', event => {
      event.preventDefault();
      const value = event.target['money-input'].value;

      this.signUpFormHandler(value);
    });
  }

  signUpFormHandler(value) {
    const $input = document.getElementById('money-input');

    const $moneyButton = document.getElementById('money-button');

    try {
      const money = new Money(value);
      const lottoMachine = new LottoMachine(money);
      $moneyButton.disabled = true;

      this.generateCountNotice(money.count);
      this.generatePurchasedLottosNotice(lottoMachine);
      this.generateWinningNumbersInputs();
      this.calculateLottoResult(lottoMachine);
    } catch (err) {
      errorAlert(err);
      $input.value = null;
    }
  }

  calculateLottoResult(lottoMachine) {
    const $numberForm = document.getElementById('number-form');
    const $numberInputs = document.getElementsByClassName('inputs');
    $numberInputs[0].focus();

    $numberForm.addEventListener('submit', event => {
      try {
        event.preventDefault();
        const value = Array.from(event.target.numberInput).map(val => {
          return val.value;
        });

        lottoMachine.winningLotto = value.slice(0, 6).join(',');
        lottoMachine.bonusNumber = value[6];
      } catch (err) {
        errorAlert(err);
      }
    });
  }

  generateCountNotice(count) {
    const $lottoCountMessageContainer = document.getElementById('lotto-count-message-container');
    $lottoCountMessageContainer.insertAdjacentHTML(
      'afterbegin',
      `<div class="content-message" disabled="true">
            총 ${count}개를 구매하였습니다.
          </div>`,
    );
  }

  generatePurchasedLottosNotice(lottoMachine) {
    const $lottosContainer = document.getElementById('lottos-container');
    lottoMachine.lottos.forEach(lotto => {
      $lottosContainer.insertAdjacentHTML(
        'afterbegin',
        `<div id="lotto-ticket">
              <div id="lotto-icon">🎟️</div>
              <div id="lotto-numbers">${lotto.lottoNumbers}</div>
            </div>`,
      );
    });
  }

  generateWinningNumbersInputs() {
    const $winningLottoContainer = document.getElementById('winning-lotto-container');
    $winningLottoContainer.insertAdjacentHTML(
      'afterbegin',
      `<div class="content-message">지난 주 당첨번호 6개와 보너스 번호 1개를 입력해주세요.</div>
            <div id="winning-lotto-message-container">
              <div class="content-message">당첨 번호</div>
              <div class="content-message">보너스 번호</div>
            </div>
            <form id="number-form">
              <div id="number-form-container">
                <div id="winning-lotto-inputs">
                  <input type="text" class="inputs" name="numberInput" maxlength="2" />
                  <input type="text" class="inputs" name="numberInput" maxlength="2" />
                  <input type="text" class="inputs" name="numberInput" maxlength="2" />
                  <input type="text" class="inputs" name="numberInput" maxlength="2" />
                  <input type="text" class="inputs" name="numberInput" maxlength="2" />
                  <input type="text" class="inputs" name="numberInput" maxlength="2" />
                </div>
                <div><input type="text" class="inputs bonusNumber-input" name="numberInput" maxlength="2" /></div>
              </div>
              <button type="submit" id="number-button">결과 확인하기</button>
            </form>`,
    );
  }
}

export default WebLottoController;
