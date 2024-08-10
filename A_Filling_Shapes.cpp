#include <bits/stdc++.h>
using namespace std;
 

int main()
{
    int n, ans;
    cin>>n;
 
    if (n % 2 != 0)
    {
        ans = 0;
    }
 
    else
    {
        int dp[n + 1];
        dp[0] = 1;
        for (int i = 2; i <= n; i += 2)
        {
            dp[i] = 2*dp[i-2];
            ans = dp[i];
        }
    }
    cout << ans <<endl;
 
    return 0;
}
