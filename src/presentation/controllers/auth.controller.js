export default class AuthController {
    constructor({ authService }) {
        this.authService = authService;
    }

    register = async (req, res) => {
        try {
            const result = await this.authService.register(req.body);
            res.status(201).json({ success: true, data: result });
        } catch (error) {
            if (error.message.includes("Email already in use")) {
                return res.status(409).json({ success: false, error: error.message });
            }
            res.status(400).json({ success: false, error: error.message });
        }
    };

    login = async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, error: "Email and password are required" });
        }
        
        try {
            const result = await this.authService.login(req.body);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            if (error.message.includes("Invalid credentials")) {
                return res.status(401).json({ success: false, error: error.message });
            }
            res.status(400).json({ success: false, error: error.message });
        }
    };
}