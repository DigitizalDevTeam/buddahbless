import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Apple, Facebook, LogOut, User, UserCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function LoginModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"default" | "google">("default");
  const { login, user, logout } = useAuth();

  const handleLogin = (provider: string) => {
    if (provider === "Google") {
      setView("google");
      return;
    }
    login(provider);
    setIsOpen(false);
  };

  const handleGoogleAccountSelect = (account: { name: string; email: string; avatar: string }) => {
    login("Google", account);
    setIsOpen(false);
    setView("default"); // Reset for next time
  };

  const mockGoogleAccounts = [
    {
      name: "illy Cartier",
      email: "illycartierofficial@gmail.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=illy1",
      color: "bg-purple-600"
    },
    {
      name: "illy Cartier",
      email: "illycartiertour@gmail.com",
      avatar: "",
      initial: "i",
      color: "bg-purple-600"
    },
    {
      name: "illy Cartier",
      email: "lovahorhater@gmail.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=illy3",
      color: "bg-orange-600"
    },
    {
      name: "illy Cartier",
      email: "fullcirclefooddrivedmv@gmail.com",
      avatar: "",
      initial: "i",
      color: "bg-teal-700"
    }
  ];

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10 border border-white/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-black border-white/10 text-white" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem className="cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) setView("default");
    }}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="font-bold hover:text-primary transition-colors">
          LOGIN
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#1d1d1d] text-white p-0 overflow-hidden gap-0 border-none shadow-2xl">
        {view === "google" ? (
          <div className="flex flex-col min-h-[500px] bg-[#1d1d1d] text-white animate-in slide-in-from-right duration-300">
            <div className="p-8 flex-1">
              <div className="flex justify-center mb-6">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </div>
              
              <h2 className="text-2xl font-normal text-center mb-2">Choose an account</h2>
              <p className="text-center text-gray-400 mb-8">to continue to Buddah Bless</p>

              <div className="space-y-1">
                {mockGoogleAccounts.map((account, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center gap-4 p-3 hover:bg-[#303030] rounded-md transition-colors text-left group border-b border-[#303030] last:border-0"
                    onClick={() => handleGoogleAccountSelect(account as any)}
                  >
                    <div className="shrink-0">
                      {account.avatar ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={account.avatar} />
                          <AvatarFallback>{account.initial}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className={`h-8 w-8 rounded-full ${account.color} flex items-center justify-center text-white text-sm`}>
                          {account.initial}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-gray-200">{account.name}</span>
                      <span className="text-xs text-gray-400">{account.email}</span>
                    </div>
                  </button>
                ))}
                
                <button className="w-full flex items-center gap-4 p-3 hover:bg-[#303030] rounded-md transition-colors text-left mt-2">
                  <div className="shrink-0">
                    <UserCircle2 className="h-8 w-8 text-gray-400" />
                  </div>
                  <span className="font-medium text-sm text-gray-200">Use another account</span>
                </button>
              </div>
            </div>
            
            <div className="p-6 border-t border-[#303030] text-center">
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Before using this app, you can review Buddah Bless's <a href="#" className="text-blue-400 hover:underline">privacy policy</a> and <a href="#" className="text-blue-400 hover:underline">terms of service</a>.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white text-black p-0">
            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-12 border-gray-300 hover:bg-gray-50 flex items-center justify-center rounded-md"
                  onClick={() => handleLogin("Google")}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="sr-only">Google</span>
                </Button>
                {/* ... other social buttons remain same ... */}
                <Button 
                  variant="outline" 
                  className="h-12 border-gray-300 hover:bg-gray-50 flex items-center justify-center rounded-md"
                  onClick={() => handleLogin("Microsoft")}
                >
                   <svg className="w-5 h-5" viewBox="0 0 23 23">
                    <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H1z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H1z"/>
                  </svg>
                  <span className="sr-only">Microsoft</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-12 border-gray-300 hover:bg-gray-50 flex items-center justify-center rounded-md"
                  onClick={() => handleLogin("Facebook")}
                >
                  <Facebook className="w-5 h-5 text-[#1877F2] fill-current" />
                  <span className="sr-only">Facebook</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-12 border-gray-300 hover:bg-gray-50 flex items-center justify-center rounded-md"
                  onClick={() => handleLogin("Apple")}
                >
                  <Apple className="w-5 h-5 text-black fill-current" />
                  <span className="sr-only">Apple</span>
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase text-gray-500">
                  <span className="bg-white px-4">OR</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900" htmlFor="email">Email address or username</label>
                  <Input
                    id="email"
                    placeholder="Email address or username"
                    className="h-12 bg-white border-gray-300 text-black placeholder:text-gray-400 focus-visible:ring-gray-400 focus-visible:border-gray-400 rounded-md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900" htmlFor="password">Password</label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    className="h-12 bg-white border-gray-300 text-black placeholder:text-gray-400 focus-visible:ring-gray-400 focus-visible:border-gray-400 rounded-md"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <a href="#" className="text-sm text-gray-500 hover:underline">Forgot password?</a>
                </div>
              </div>

              <Button 
                className="w-full h-12 bg-[#1ed760] hover:bg-[#1fdf64] text-black font-bold rounded-full text-base transition-colors"
                onClick={() => handleLogin("Email")}
              >
                Log in
              </Button>

              <div className="text-center pt-2">
                <span className="text-sm text-gray-600">Don't have an account? </span>
                <a href="#" className="text-sm font-bold text-gray-900 hover:underline">Sign up</a>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
