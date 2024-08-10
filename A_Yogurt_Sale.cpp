#include <bits/stdc++.h>
using namespace std;

int main() {
    int t;
    cin >> t;
    
    while (t--) {
        int n, a, b;
        cin >>n>>a>>b;
    
        int x = n*a;
        int y = (n/2)*b+(n%2)*a;
        int cost = min(x, y);
        cout << cost << endl;
    }
    
    return 0;
}
