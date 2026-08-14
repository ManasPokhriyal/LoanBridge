	package com.backend.security;
	
	import java.util.Collection;
	import java.util.List;
	
	import org.springframework.security.core.GrantedAuthority;
	import org.springframework.security.core.authority.SimpleGrantedAuthority;
	import org.springframework.security.core.userdetails.UserDetails;
	
	import com.backend.entities.Role;
	
	import lombok.AllArgsConstructor;
	import lombok.Getter;
	
	/**
	 * Custom implementation of Spring Security's UserDetails interface.
	 * Wraps database User attributes for Spring Security authentication & authorization.
	 */
	@Getter
	@AllArgsConstructor
	public class CustomUserDetailsImpl implements UserDetails {
	
	    private Long userId;
	    private String email;
	    private String password;
	    private Role role;
	    private String name;
	
	    @Override
	    public Collection<? extends GrantedAuthority> getAuthorities() {
	        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
	    }
	
	    @Override
	    public String getUsername() {
	        return this.email;
	    }
	
	    @Override
	    public boolean isAccountNonExpired() {
	        return true;
	    }
	
	    @Override
	    public boolean isAccountNonLocked() {
	        return true;
	    }
	
	    @Override
	    public boolean isCredentialsNonExpired() {
	        return true;
	    }
	
	    @Override
	    public boolean isEnabled() {
	        return true;
	    }
	}
