const POLY_WS_STOCKS_URL = "wss://socket.polygon.io/stocks"

type StatusMsg = { ev: 'status'; status: string };
type SymbolMsg = { ev: 'T' | 'Q' | 'A'; sym: string };
type PolygonMessage = StatusMsg | SymbolMsg;

function isStatusMessage(msg: PolygonMessage): msg is StatusMsg {
    return msg.ev === 'status' && 'status' in msg;
}

function isSymbolMessage(msg: PolygonMessage): msg is SymbolMsg {
    return msg.ev === 'T' || msg.ev === 'Q' || msg.ev === 'A';
}

export class PolygonWebSocket {
    private ws: WebSocket | null = null;
    private apiKey: string;
    private subscriptions: Set<string> = new Set();
    private messageHandlers: Map<string, (data: SymbolMsg) => void> = new Map();

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(POLY_WS_STOCKS_URL);

                this.ws.onopen = () => {
                    console.log('WebSocket connected');
                    this.authenticate();
                    resolve();
                };

                this.ws.onmessage = (event) => {
                    const messages = JSON.parse(event.data);
                    if (Array.isArray(messages)) {
                        messages.forEach(this.handleMessage.bind(this));
                    }
                };

                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    reject(error);
                };

                this.ws.onclose = () => {
                    console.log('WebSocket disconnected');
                    setTimeout(() => this.reconnect(), 5000);
                };
            } catch (error) {
                reject(error);
            }
        });
    }

    private authenticate() {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                action: 'auth',
                params: this.apiKey
            }));
        }
    }

    private handleMessage(message: PolygonMessage) {
        if (isStatusMessage(message)) {
            if (message.status === 'auth_success') {
                this.resubscribe()
            }
            return;
        }

        if (isSymbolMessage(message)) {
            const handler = this.messageHandlers.get(message.sym);
            if (handler) handler(message);
        }
    }

    subscribe(symbol: string, handler: (data: PolygonMessage) => void) {
        this.subscriptions.add(symbol);
        this.messageHandlers.set(symbol, handler);

        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                action: 'subscribe',
                params: `T.${symbol},Q.${symbol},A.${symbol}`
            }));
        }
    }

    unsubscribe(symbol: string) {
        this.subscriptions.delete(symbol);
        this.messageHandlers.delete(symbol);

        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                action: 'unsubscribe',
                params: `T.${symbol},Q.${symbol},A.${symbol}`
            }));
        }
    }

    private resubscribe() {
        if (this.subscriptions.size > 0) {
            const params = Array.from(this.subscriptions)
                .map(s => `T.${s},Q.${s},A.${s}`)
                .join(',');

            if (this.ws?.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({
                    action: 'subscribe',
                    params
                }));
            }
        }
    }

    private reconnect() {
        console.log('Attempting to reconnect...');
        this.connect();
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}
