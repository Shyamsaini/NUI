import { Component, OnInit } from '@angular/core';
import { RoleServiceService } from '../../pages/services/role-service.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-assign',
  templateUrl: './role-assign.component.html',
  styleUrls: ['./role-assign.component.css']
})
export class RoleAssignComponent implements OnInit {

  roles: any[] = [];
  menus: any[] = [];  
  selectedRole: string = ""; // Variable to hold the selected role
  isSaveDiv: boolean | undefined;

  constructor(private roleService: RoleServiceService,private router: Router) {}

  ngOnInit(): void {
    // Fetch roles when the component initializes
    this.isSaveDiv = false;
    this.roleService.getRoles().subscribe(
      (data: any[]) => {
        this.roles = data;
      },
      (error: any) => {
        console.error('Error fetching roles', error);
      }
    );
  }

  // Handle role change and fetch menus for the selected role
  onRoleChange() {
    this.isSaveDiv = false;
    this.roleService.getMenusByRole(this.selectedRole).subscribe(response => {
      this.menus = response; // Update menus based on selected role
      this.isSaveDiv = true;
    });
  }

  // Handle the toggle of parent menu to propagate changes to child menus
  toggleChildren(menu: any): void {
    menu.children.forEach((child: any) => {
      child.menuExists = menu.menuExists; // Toggle child menu based on parent
    });
  }

  // Handle changes in child menu selection
  onChildChange(menu: any): void {
    // Check if all children are selected or not, and set parent menu accordingly
    menu.menuExists = menu.children.every((child: any) => child.menuExists);
  }

  // Save role assignment by sending the selected role and its associated menus to the API
  saveRoleAssignment(): void {
    // Prepare data to be sent to the API, including selected role and updated menus
    const payload = {
      role: this.selectedRole,
      menus: this.menus
    };

    this.roleService.saveMenuAssignment(payload).subscribe(
      (response) => {
        Swal.fire({
          position: 'top-end', // Or 'center-end' for center-right position
          title: 'Role assignment saved successfully!',
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: 'custom-alert',
            title: 'custom-title',
          },
          background: '#006400', // Green background
        });
         this.router.navigate(['/role-assign']);
      },
      (error) => {
        Swal.fire({
          position: 'top-end', // Or 'center-end' for center-right position
          title: 'Failed to save role assignment!',
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: 'custom-alert',
            title: 'custom-title',
          },
          background: '#006400', // Green background
        });
         this.router.navigate(['/role-assign']);
      }
    );
  }
  
  // Reset the menu states (uncheck all checkboxes)
  resetRoleAssignment(): void {
    this.menus.forEach((menu) => {
      menu.menuExists = false; // Uncheck parent menu
      menu.children.forEach((child: { menuExists: boolean; }) => {
        child.menuExists = false; // Uncheck child menu
      });
    });
  }
}
