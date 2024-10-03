import requests
import logging
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
from colorama import Fore, Style, init

# Initialize colorama for colored output
init(autoreset=True)

# Set up logging
logging.basicConfig(filename='telegram_bot.log', level=logging.INFO, format='%(asctime)s - %(message)s')

# Your Stripe checking function
def check_stripe_key(sk_key):
    key_type = "Live Key" if sk_key.startswith("sk_live") else "Test Key"
    logging.info(f"Checking {key_type}: {sk_key}")

    tests = {
        "Charges Access": "https://api.stripe.com/v1/charges",
        "Customers Access": "https://api.stripe.com/v1/customers",
        "Refunds Access": "https://api.stripe.com/v1/refunds",
        "Balance Access": "https://api.stripe.com/v1/balance",
    }

    headers = {
        "Authorization": f"Bearer {sk_key}"
    }

    passed = 0
    failed = 0
    results = []

    for test_name, url in tests.items():
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            results.append(f"✅ {test_name} - Valid and Accessible")
            passed += 1
        else:
            results.append(f"❌ {test_name} - Failed or Inaccessible (Status: {response.status_code})")
            failed += 1

    return f"Summary: \n{passed} Passed\n{failed} Failed\n\n" + "\n".join(results)

# Telegram bot commands
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Welcome! Use /checkkey <sk_key> to validate a Stripe secret key.")

async def checkkey(update: Update, context: ContextTypes.DEFAULT_TYPE):
    sk_key = ' '.join(context.args)
    if not sk_key:
        await update.message.reply_text("Please provide a Stripe Secret Key. Example: /checkkey sk_live_...")
        return

    # Call the function to check the key
    result = check_stripe_key(sk_key)
    await update.message.reply_text(result)

async def account(update: Update, context: ContextTypes.DEFAULT_TYPE):
    sk_key = ' '.join(context.args)
    if not sk_key:
        await update.message.reply_text("Please provide a Stripe Secret Key. Example: /account sk_live_...")
        return

    # Fetch account details from Stripe
    response = requests.get("https://api.stripe.com/v1/account", headers={"Authorization": f"Bearer {sk_key}"})
    if response.status_code == 200:
        account_data = response.json()
        result = f"Account Name: {account_data['business_name']}\nCountry: {account_data['country']}"
    else:
        result = "Failed to retrieve account details. Invalid key or permission issues."

    await update.message.reply_text(result)

# Main setup for the Telegram bot
async def main():
    # Replace 'YOUR_BOT_TOKEN' with your actual bot token from BotFather
    application = ApplicationBuilder().token('7080153920:AAHICBs8fb9RHwfJ3jywwVZpISYsul1YKec').build()

    # Add command handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("checkkey", checkkey))
    application.add_handler(CommandHandler("account", account))

    # Start the bot
    await application.start_polling()
    await application.idle()

if __name__ == '__main__':
    import asyncio
    asyncio.run(main())
