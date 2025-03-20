import { Request, Response } from 'express';
import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

export const scrapeWithSelenium = async (req: Request, res: Response): Promise<void> => {
  let driver;

  try {
    // Configura o driver do Selenium para o Chrome
    const options = new chrome.Options();
    options.addArguments('--headless'); // Roda no modo headless (sem interface gráfica)
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    // Acessa a página e faz o scraping
    await driver.get('https://example.com'); // URL do site que deseja fazer o scraping
    const title = await driver.getTitle(); // Exemplo de scraping (obter título)
    const header = await driver.findElement(By.tagName('h1')).getText(); // Exemplo de scraping (obter texto do header)

    // Retorna os dados
    res.json({
      title,
      header,
    });
  } catch (error) {
    // Afirmação de tipo para acessar a propriedade 'message'
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send('Erro desconhecido');
    }
  } finally {
    if (driver) {
      await driver.quit(); // Fecha o driver do Selenium
    }
  }
};
