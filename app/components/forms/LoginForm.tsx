import { Link, Form } from "react-router";

interface LoginFormProps {
  error?: string;
  loginInfo: {
    loginName?: string | null;
    loginImgUrl?: string | null;
  };
}

export default function LoginForm({ error, loginInfo }: LoginFormProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            {loginInfo?.loginImgUrl && (
              <img
                src={loginInfo.loginImgUrl}
                alt={loginInfo.loginName ?? "Login Logo"}
                className="h-50 w-42 mx-auto mb-5"
              />
            )}
            <h1 className="text-2xl font-semibold text-white mb-2">
              {loginInfo?.loginName ?? "Welcome Back"}
            </h1>
            <p className="text-gray-400 text-sm">Sign in to your account</p>
          </div>

          <Form action="/login" method="post" className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-300 block"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                maxLength={254}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-300 block"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 mt-4"
            >
              Sign In
            </button>

            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-gray-400 text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </main>
  );
}
