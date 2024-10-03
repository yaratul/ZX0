// Import dependencies
const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');

// Create a new Telegraf bot instance
const bot = new Telegraf('7080153920:AAHICBs8fb9RHwfJ3jywwVZpISYsul1YKec'); // Replace with your BotFather token

// Function to check the Stripe key
async function checkStripeKey(sk_key) {
    const tests = {
        "Charges Access": "https://api.stripe.com/v1/charges",
        "Customers Access": "https://api.stripe.com/v1/customers",
        "Refunds Access": "https://api.stripe.com/v1/refunds",
        "Balance Access": "https://api.stripe.com/v1/balance",
    };

    const headers = {
        "Authorization": `Bearer ${sk_key}`
    };

    let passed = 0;
    let failed = 0;
    let results = [];

    for (const [testName, url] of Object.entries(tests)) {
        try {
            const response = await fetch(url, { headers });
            if (response.ok) {
                results.push(`✅ ${testName} - Valid and Accessible`);
                passed++;
            } else {
                results.push(`❌ ${testName} - Failed or Inaccessible (Status: ${response.status})`);
                failed++;
            }
        } catch (error) {
            results.push(`❌ ${testName} - Error: ${error.message}`);
            failed++;
        }
    }

    return `Summary: \n${passed} Passed\n${failed} Failed\n\n` + results.join('\n');
}

// Command: /start
bot.start((ctx) => {
    ctx.reply('Welcome! Use /checkkey <sk_key> to validate a Stripe secret key.');
});

// Command: /checkkey
bot.command('checkkey', async (ctx) => {
    const sk_key = ctx.message.text.split(' ')[1];
    if (!sk_key) {
        ctx.reply("Please provide a Stripe Secret Key. Example: /checkkey sk_live_...");
        return;
    }

    const result = await checkStripeKey(sk_key);
    ctx.reply(result);
});

// Command: /account
bot.command('account', async (ctx) => {
    const sk_key = ctx.message.text.split(' ')[1];
    if (!sk_key) {
        ctx.reply("Please provide a Stripe Secret Key. Example: /account sk_live_...");
        return;
    }

    try {
        const response = await fetch("https://api.stripe.com/v1/account", {
            headers: { "Authorization": `Bearer ${sk_key}` }
        });
        if (response.ok) {
            const accountData = await response.json();
            const result = `Account Name: ${accountData.business_name || 'N/A'}\nCountry: ${accountData.country}`;
            ctx.reply(result);
        } else {
            ctx.reply("Failed to retrieve account details. Invalid key or permission issues.");
        }
    } catch (error) {
        ctx.reply(`Error: ${error.message}`);
    }
});

// Start the bot
bot.launch().then(() => {
    console.log('Bot is running...');
}).catch((error) => {
    console.error('Failed to launch bot:', error);
});            passed += 1
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
