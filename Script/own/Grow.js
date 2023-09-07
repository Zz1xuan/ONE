const bodyText = $response.body;

// 替换 "entitlements": {} 为指定的 JSON 对象
const modifiedBody = bodyText.replace(/"entitlements": {}/g, `{
    "grow.pro": {
        "expires_date": "2023-09-14T01:20:15Z",
        "grace_period_expires_date": null,
        "product_identifier": "grow_1y_128",
        "purchase_date": "2023-09-07T01:20:15Z"
    }
}`);

// 替换 "management_url": null 为指定的 URL
const modifiedBody2 = modifiedBody.replace(/"management_url": null/g, `"management_url": "https://apps.apple.com/account/subscriptions"`);

// 替换 "subscriptions": {} 为指定的 JSON 对象
const modifiedBody3 = modifiedBody2.replace(/"subscriptions": {}/g, `{
    "grow_1y_128": {
        "auto_resume_date": null,
        "billing_issues_detected_at": null,
        "expires_date": "2024-09-07T01:20:15Z",
        "grace_period_expires_date": null,
        "is_sandbox": false,
        "original_purchase_date": "2023-09-07T01:20:15Z",
        "ownership_type": "PURCHASED",
        "period_type": "annual",
        "purchase_date": "2023-09-07T01:20:15Z",
        "refunded_at": null,
        "store": "app_store",
        "store_transaction_id": "510001332208333",
        "unsubscribe_detected_at": null
    }
}`);

$done({ body: modifiedBody3 });
