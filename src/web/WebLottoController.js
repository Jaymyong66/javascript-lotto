import LottoMachine from '../domain/model/LottoMachine';
import Money from '../domain/model/Money';
import { errorAlert } from '../util/errorAlert';
import { calculateROI } from '../domain/calculateStatistics';
import LOTTO_RULE from '../constants/rules/lottoRule';

class WebLottoController {
  #money;

  start() {
    const $signupForm = document.getElementById('money-form');
    const $moneyInput = document.getElementById('money-input');

    $moneyInput.focus();

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

      this.#money = money;
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
    const $numberInputs = document.getElementsByClassName('number-input');

    $numberInputs[0].focus();
    let isFirstButtonClick = true;

    $numberForm.addEventListener('submit', event => {
      try {
        event.preventDefault();
        const value = Array.from(event.target.numberInput).map(val => {
          return val.value;
        });

        lottoMachine.winningLotto = value.slice(0, 6).join(LOTTO_RULE.NUMBER_DELIMITER);
        lottoMachine.bonusNumber = value[6];

        this.openResultModal(lottoMachine, isFirstButtonClick);
        isFirstButtonClick = false;
      } catch (err) {
        errorAlert(err);
      }
    });
  }

  generateCountNotice(count) {
    const $lottoCountMessageContainer = document.getElementById('lotto-count-message-container');
    $lottoCountMessageContainer.insertAdjacentHTML(
      'afterbegin',
      `<div class="content-message body-text" disabled="true">
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
              <div class="icon">🎟️</div>
              <div id="lotto-numbers" class="body-text">${lotto.lottoNumbers}</div>
            </div>`,
      );
    });
  }

  generateWinningNumbersInputs() {
    const $winningLottoContainer = document.getElementById('winning-lotto-container');
    $winningLottoContainer.insertAdjacentHTML(
      'afterbegin',
      `<div class="content-message body-text">지난 주 당첨번호 6개와 보너스 번호 1개를 입력해주세요.</div>
            <div id="winning-lotto-message-container">
              <div class="content-message body-text">당첨 번호</div>
              <div class="content-message body-text">보너스 번호</div>
            </div>
            <form id="number-form">
              <div id="number-form-container">
                <div id="winning-lotto-inputs">
                  <input type="text" class="number-input" name="numberInput" maxlength="2" />
                  <input type="text" class="number-input" name="numberInput" maxlength="2" />
                  <input type="text" class="number-input" name="numberInput" maxlength="2" />
                  <input type="text" class="number-input" name="numberInput" maxlength="2" />
                  <input type="text" class="number-input" name="numberInput" maxlength="2" />
                  <input type="text" class="number-input" name="numberInput" maxlength="2" />
                </div>
                <div><input type="text" class="number-input bonusNumber-input" name="numberInput" maxlength="2" /></div>
              </div>
              <button type="submit" id="number-button" class="lotto-button caption-text">결과 확인하기</button>
            </form>`,
    );
  }

  openResultModal(lottoMachine, isFirstButtonClick) {
    const $resultModal = document.getElementById('result-modal');
    const $lottoResultTbodyRank = document.getElementsByClassName('lotto-result-tbody-rank');
    const $resultModalRoi = document.getElementById('result-modal-roi');

    $resultModal.classList.remove('hidden');

    const totalLottoRanks = lottoMachine.countLottoRanks();

    if (isFirstButtonClick) {
      Array.from($lottoResultTbodyRank)
        .reverse() // constant와 출력 순서가 반대 (RANKS : FIRST{}, SECOND{} ...)
        .forEach((rank, idx) => {
          rank.insertAdjacentHTML('afterbegin', `${totalLottoRanks[idx][1]}개`);
        });

      $resultModalRoi.insertAdjacentHTML(
        'afterbegin',
        `당신의 총 수익률은 ${calculateROI(this.#money, totalLottoRanks)}%입니다`,
      );
    }

    this.clickExitButtonHandler();
    this.clickRestartButtonHandler();
  }

  clickExitButtonHandler() {
    const $modalExitButton = document.getElementById('modal-exit-button');
    const $resultModal = document.getElementById('result-modal');

    $modalExitButton.addEventListener('click', () => {
      $resultModal.classList.add('hidden');
    });
  }

  clickRestartButtonHandler() {
    const $restartButton = document.getElementById('restart-button');

    $restartButton.addEventListener('click', () => {
      location.reload();
    });
  }
}

export default WebLottoController;
