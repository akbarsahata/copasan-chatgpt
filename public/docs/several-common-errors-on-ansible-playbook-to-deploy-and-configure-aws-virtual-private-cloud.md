# Several Common Errors on Ansible Playbook to Deploy and Configure AWS Virtual Private Cloud

---

![error-red](https://images.pexels.com/photos/2882552/pexels-photo-2882552.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1)

---

When using an Ansible playbook to deploy and configure an AWS Virtual Private Cloud (VPC), several logical errors may arise due to incorrect parameters, resource dependencies, or improper configurations. Below are common logical errors with examples and their solutions.

---

### 1. **Incorrect Module Usage**
   - **Problem:** Using the wrong module or not specifying the correct resource in the module.
   - **Error Example:**
     ```yaml
     - name: Create a public subnet
       ec2_vpc:
         vpc_id: "{{ vpc.vpc_id }}"
         cidr: 10.0.1.0/24
         availability_zone: us-east-1a
     ```
     - **Logical Issue:** The `ec2_vpc` module is incorrectly used to create a subnet. The correct module is `ec2_vpc_subnet`.
     - **Solution:** Replace `ec2_vpc` with `ec2_vpc_subnet`.

---

### 2. **Invalid or Missing Parameters**
   - **Problem:** Some required parameters for modules are either missing or invalid.
   - **Error Example:**
     ```yaml
     - name: Create a VPC
       ec2_vpc:
         name: my_vpc
         cidr_block: 10.0.0.1/16   # Invalid CIDR block
     ```
     - **Logical Issue:** The CIDR block `10.0.0.1/16` is invalid because `10.0.0.1` is not a valid network address.
     - **Solution:** Use `10.0.0.0/16` as the correct CIDR block.

---

### 3. **Resource Dependencies and Sequencing**
   - **Problem:** Not respecting dependencies between AWS resources.
   - **Error Example:**
     ```yaml
     - name: Create a route table
       ec2_vpc_route_table:
         vpc_id: "{{ vpc.vpc_id }}"
         state: present

     - name: Create a VPC
       ec2_vpc:
         name: my_vpc
         cidr_block: 10.0.0.0/16
         state: present
     ```
     - **Logical Issue:** The route table is being created before the VPC, causing a failure because the VPC doesn't exist yet.
     - **Solution:** Move the VPC creation task before the route table creation.

---

### 4. **Inconsistent or Overlapping CIDR Blocks**
   - **Problem:** Defining overlapping CIDR blocks for subnets within the same VPC.
   - **Error Example:**
     ```yaml
     - name: Create public subnet
       ec2_vpc_subnet:
         vpc_id: "{{ vpc.vpc_id }}"
         cidr: 10.0.0.0/24
         state: present

     - name: Create another subnet
       ec2_vpc_subnet:
         vpc_id: "{{ vpc.vpc_id }}"
         cidr: 10.0.0.0/25   # Overlaps with the first subnet
         state: present
     ```
     - **Logical Issue:** The CIDR block for the second subnet overlaps with the first, causing a conflict.
     - **Solution:** Ensure the CIDR blocks don't overlap, e.g., use `10.0.1.0/24` for the second subnet.

---

### 5. **Incorrect Association of Route Tables**
   - **Problem:** Assigning incorrect route tables to subnets or missing associations between subnets and route tables.
   - **Error Example:**
     ```yaml
     - name: Create a route to the internet gateway
       ec2_vpc_route:
         route_table_id: "{{ route_table.route_table_id }}"
         destination_cidr_block: "0.0.0.0/0"
         gateway_id: "invalid-igw-id"  # Incorrect gateway ID
     ```
     - **Logical Issue:** The route table is being associated with an incorrect or nonexistent internet gateway.
     - **Solution:** Ensure the correct internet gateway ID is used by registering the result of the internet gateway creation task and using the correct variable.

---

### 6. **Improper Security Group Configuration**
   - **Problem:** Misconfiguring security groups, either by allowing too permissive or restrictive rules.
   - **Error Example:**
     ```yaml
     - name: Create a security group
       ec2_security_group:
         name: "open_sg"
         description: "Allow all traffic"
         vpc_id: "{{ vpc.vpc_id }}"
         rules:
           - proto: all
             cidr_ip: 0.0.0.0/0   # Too permissive, allows all traffic
     ```
     - **Logical Issue:** The security group is configured to allow all traffic from any IP, which is a significant security risk.
     - **Solution:** Restrict traffic to specific ports and IP ranges, e.g., only allowing SSH or HTTP/HTTPS traffic from trusted IP addresses.

---

### 7. **Forgotten Tags or Naming Conventions**
   - **Problem:** Tags are critical for identifying and managing resources, especially in large-scale environments.
   - **Error Example:**
     ```yaml
     - name: Create a VPC
       ec2_vpc:
         cidr_block: 10.0.0.0/16
         enable_dns_support: true
     ```
     - **Logical Issue:** The VPC does not have any tags, making it harder to manage in larger environments.
     - **Solution:** Add tags, for example:
       ```yaml
       tags:
         Name: "my_vpc"
         Environment: "production"
       ```

---

### 8. **Failure to Handle Existing Resources**
   - **Problem:** Playbook fails or overwrites existing resources.
   - **Error Example:**
     ```yaml
     - name: Create a VPC
       ec2_vpc:
         cidr_block: 10.0.0.0/16
         state: present
     ```
     - **Logical Issue:** If a VPC with the same CIDR block already exists, this task will fail.
     - **Solution:** Implement checks or use idempotent modules to verify if the resource already exists before attempting to create it. Use `ec2_vpc_facts` to check existing VPCs.

---

### 9. **Failure to Wait for Resource Propagation**
   - **Problem:** Ansible tasks that depend on the completion of another resource’s creation may fail if the resources are not yet fully available.
   - **Error Example:**
     ```yaml
     - name: Create a route to the internet gateway
       ec2_vpc_route:
         route_table_id: "{{ route_table.route_table_id }}"
         destination_cidr_block: "0.0.0.0/0"
         gateway_id: "{{ igw.internet_gateway_id }}"
     ```
     - **Logical Issue:** This task may fail if the internet gateway is not fully available yet.
     - **Solution:** Use a wait condition to allow time for resource propagation:
       ```yaml
       - wait_for:
           timeout: 300
           state: started
       ```

---

### 10. **Misconfigured NAT Gateway or Internet Gateway**
   - **Problem:** Improper configuration of NAT gateway for private subnets or internet gateway for public subnets.
   - **Error Example:**
     ```yaml
     - name: Create a route for private subnet
       ec2_vpc_route:
         route_table_id: "{{ private_route_table.route_table_id }}"
         destination_cidr_block: "0.0.0.0/0"
         gateway_id: "{{ igw.internet_gateway_id }}"  # Incorrectly uses internet gateway for private subnet
     ```
     - **Logical Issue:** The private subnet is incorrectly routed through the internet gateway instead of a NAT gateway.
     - **Solution:** Use a NAT gateway for private subnets:
       ```yaml
       gateway_id: "{{ nat_gateway.nat_gateway_id }}"
       ```

---

### Best Practices to Avoid Errors
- **Use Idempotent Modules:** Ensure that each module used is idempotent, so running the playbook multiple times doesn't create duplicate resources.
- **Test Playbook Locally:** Before deploying to production, run the playbook in a test environment or use mock modules like `local_action` to validate syntax and logic.
- **Error Handling:** Implement error handling in the playbook to catch and manage errors gracefully (e.g., using `ignore_errors` with caution).

---

### References

1. **Ansible AWS VPC Module Documentation**  
   [https://docs.ansible.com/ansible/latest/collections/amazon/aws/ec2_vpc_module.html](https://docs.ansible.com/ansible/latest/collections/amazon/aws/ec2_vpc_module.html)

2. **Ansible Playbooks for AWS – Best Practices**  
   [https://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html](https://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html)

3. **AWS Ansible Integration Guide**  
   [https://aws.amazon.com/blogs/devops/getting-started-with-ansible-and-aws/](https://aws.amazon.com/blogs/devops/getting-started-with-ansible-and-aws/)

4. **AWS VPC Best Practices**  
   [https://docs.aws.amazon.com/vpc/latest/userguide/vpc-best-practices.html](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-best-practices.html)
