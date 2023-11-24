package mn.random.company.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class MainService {
    @Inject
    SQLService service;


}
