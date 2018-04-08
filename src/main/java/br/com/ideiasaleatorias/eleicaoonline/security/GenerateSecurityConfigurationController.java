package br.com.ideiasaleatorias.eleicaoonline.security;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@Transactional
public class GenerateSecurityConfigurationController {

	@PersistenceContext
	private EntityManager entityManager;

	@RequestMapping("/magic/generate/roles/dfhjskhgfsjdkgfjdkshgjfdjkdfkghjkfdhgjkf")
	@ResponseBody
	public String generateRoles() {
		entityManager.persist(Role.ELLECTION_OWNER);
		return "gerado filhão";
	}

	@RequestMapping("/magic/generate/owner/dfhjskhgfsjdkgfjdkshgjfdjkdfkghjkfdhgjkf")
	@ResponseBody
	public String generateOwner() {
		SystemUser user = new SystemUser("teste", "teste@gmail.com",
				Password.buildWithRawText("123456"), Role.ELLECTION_OWNER);
		entityManager.persist(user);
		return "gerado usuario";
	}
}
