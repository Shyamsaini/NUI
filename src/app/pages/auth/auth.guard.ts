import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userData = localStorage.getItem('userData');

  if (userData) {
    const parsedData = JSON.parse(userData);
    const menuItems = parsedData.menu || [];
    const requestedUrl = state.url.startsWith('/') ? state.url.substring(1) : state.url;

    // Recursive function to check access in menus and submenus
    const checkAccess = (menus: any[], url: string): boolean => {
      return menus.some((item: any) => {
        // Check if the current menu item has the access URL
        if (item.accessUrl === url) {
          return true;
        }
        // If subMenu exists, check recursively
        if (item.subMenu && item.subMenu.length > 0) {
          return checkAccess(item.subMenu, url);
        }
        return false;
      });
    };

    // Check access in both main menus and submenus
    const hasAccess = checkAccess(menuItems, requestedUrl);

    if (!hasAccess) {
      // Redirect to an unauthorized page or show an alert
      router.navigate(['/access-denied']);  // Ensure this route exists
      return false;
    }
    return true;  // Allow navigation if access is permitted
  } else {
    // If no user data found, redirect to login or any default route
    router.navigate(['']);  // Ensure this route exists
    return false;
  }
};
