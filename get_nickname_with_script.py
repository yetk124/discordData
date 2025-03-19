
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

def get_nickname_with_script(user_id):
    stats_url = f"https://barracks.sa.nexon.com/{user_id}/match"

    chrome_options = Options()
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)

    try:
        driver.get(stats_url)

        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        wait = WebDriverWait(driver, 15)
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#user > div.information > div.nickname > p")))

        player_name = driver.execute_script(
            "return document.querySelector('#user > div.information > div.nickname > p')?.innerText || '❌ 닉네임 없음.';"
        )
        overall_kd = driver.execute_script(
            "return document.querySelector('#user > div.summaries > ul:nth-child(2) > li:nth-child(2) > span.value.Rajdhani.text-white')?.innerText || '❌ 전체 K/D 없음.';"
        )
        rifle_kd = driver.execute_script(
            "return document.querySelector('#user > div.summaries > ul:nth-child(2) > li:nth-child(2) > div > ul > li:nth-child(1) > span.value.Rajdhani.text-white')?.innerText || '❌ 라플 K/D 없음.';"
        )
        sniper_kd = driver.execute_script(
            "return document.querySelector('#user > div.summaries > ul:nth-child(2) > li:nth-child(2) > div > ul > li:nth-child(2) > span.value.Rajdhani.text-white')?.innerText || '❌ 스나 K/D 없음.';"
        )

        return {
            "닉네임": player_name,
            "유저 ID": user_id,
            "병영수첩 링크": stats_url,
            "전체 K/D": overall_kd,
            "라플 K/D": rifle_kd,
            "스나 K/D": sniper_kd
        }

    except Exception as e:
        return {"error": f"❌ 오류 발생: {e}"}

    finally:
        driver.quit()
