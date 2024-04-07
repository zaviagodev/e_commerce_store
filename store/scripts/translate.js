import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({
    path: ".env",
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const locales = ['en', 'th']
const localesPath = 'src/locales/'

const translate = async (locale, sentence) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "system",
                    "content": `You will be provided with a sentence in English, and your task is to translate it into ${locale} i18n code. Your response should be in the json format: ${locale}: { "translation": "..." }.`
                },
                {
                    "role": "user",
                    "content": sentence
                }
            ],
            response_format: { "type": "json_object" },
            temperature: 0.7,
            max_tokens: 64,
            top_p: 1,
        });

        return JSON.parse(response.choices[0].message.content);
    } catch (error) {
        console.error(`Error translating "${sentence}" to ${locale}: ${error.message}`);
        return sentence;
    }
};

const main = async () => {
    for (const locale of locales) {
        console.log(`Translating ${locale}...`);
        const localePath = path.join(localesPath, `${locale}.json`);
        const translations = JSON.parse(fs.readFileSync(localePath, 'utf8'));
        const newTranslations = {};

        const promises = Object.keys(translations).map((sentence) => translate(locale, sentence));

        const responses = await Promise.all(promises);

        Object.keys(translations).forEach((sentence, index) => {
            newTranslations[sentence] = responses[index][locale]?.translation
        });

        fs.writeFileSync(localePath, JSON.stringify(newTranslations, null, 2));
    }
}

main();